import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationSessionDto } from './dto/create-conversation-session.dto';
import { UpdateConversationSessionDto } from './dto/update-conversation-session.dto';

@Injectable()
export class ConversationSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConversationSessionDto: CreateConversationSessionDto) {
    const session = await this.prisma.conversationSession.create({
      data: {
        userId: createConversationSessionDto.userId,
        topicId: createConversationSessionDto.topicId,
        status:
          (createConversationSessionDto.status as SessionStatus | undefined) ??
          SessionStatus.started,
        startedAt: createConversationSessionDto.startedAt,
        endedAt: createConversationSessionDto.endedAt,
        transcriptText: createConversationSessionDto.transcriptText,
        fluencyScore: createConversationSessionDto.fluencyScore,
        pronunciationScore: createConversationSessionDto.pronunciationScore,
        grammarScore: createConversationSessionDto.grammarScore,
        overallScore: createConversationSessionDto.overallScore,
        audioUrl: createConversationSessionDto.audioUrl,
      },
    });

    if (session.status === SessionStatus.completed) {
      await this.applySessionCompletionRules(session.id);
    }

    return session;
  }

  findAll() {
    return this.prisma.conversationSession.findMany({
      include: { feedback: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.conversationSession.findUnique({
      where: { id },
      include: { feedback: true, generatedTests: true },
    });

    if (!session) {
      throw new NotFoundException(`Conversation session ${id} not found`);
    }

    return session;
  }

  async update(
    id: string,
    updateConversationSessionDto: UpdateConversationSessionDto,
  ) {
    const previous = await this.findOne(id);

    const updated = await this.prisma.conversationSession.update({
      where: { id },
      data: {
        userId: updateConversationSessionDto.userId,
        topicId: updateConversationSessionDto.topicId,
        status: updateConversationSessionDto.status as
          | SessionStatus
          | undefined,
        startedAt: updateConversationSessionDto.startedAt,
        endedAt: updateConversationSessionDto.endedAt,
        transcriptText: updateConversationSessionDto.transcriptText,
        fluencyScore: updateConversationSessionDto.fluencyScore,
        pronunciationScore: updateConversationSessionDto.pronunciationScore,
        grammarScore: updateConversationSessionDto.grammarScore,
        overallScore: updateConversationSessionDto.overallScore,
        audioUrl: updateConversationSessionDto.audioUrl,
      },
    });

    const movedToCompleted =
      previous.status !== SessionStatus.completed &&
      updated.status === SessionStatus.completed;

    if (movedToCompleted) {
      await this.applySessionCompletionRules(updated.id);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.conversationSession.delete({ where: { id } });
  }

  private async applySessionCompletionRules(sessionId: string) {
    const session = await this.prisma.conversationSession.findUnique({
      where: { id: sessionId },
      include: { feedback: true },
    });

    if (!session) {
      return;
    }

    const score = this.resolveSessionScore(session);
    const weakestCategory = this.detectWeakestCategory(session.feedback);

    const targetSkill =
      (weakestCategory &&
        (await this.prisma.skill.findFirst({
          where: { category: weakestCategory, isActive: true },
          orderBy: { name: 'asc' },
        }))) ||
      (await this.prisma.skill.findFirst({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }));

    if (!targetSkill) {
      return;
    }

    const now = new Date();
    const totalQuestions = this.computeFollowUpQuestionCount(
      score,
      session.feedback.length,
    );

    await this.prisma.$transaction(async (tx) => {
      const existingProgress = await tx.skillProgress.findFirst({
        where: {
          userId: session.userId,
          skillId: targetSkill.id,
          topicId: session.topicId,
        },
      });

      if (existingProgress) {
        const previousMastery = Number(existingProgress.masteryLevel);
        const blendedMastery = this.roundTwoDecimals(
          previousMastery * 0.7 + score * 0.3,
        );

        await tx.skillProgress.update({
          where: { id: existingProgress.id },
          data: {
            masteryLevel: blendedMastery,
            lastScore: score,
            lastPracticedAt: now,
          },
        });
      } else {
        await tx.skillProgress.create({
          data: {
            userId: session.userId,
            skillId: targetSkill.id,
            topicId: session.topicId,
            masteryLevel: score,
            lastScore: score,
            lastPracticedAt: now,
          },
        });
      }

      const alreadyGenerated = await tx.generatedTest.findFirst({
        where: { sourceSessionId: session.id },
      });

      if (!alreadyGenerated) {
        await tx.generatedTest.create({
          data: {
            userId: session.userId,
            topicId: session.topicId,
            sourceSessionId: session.id,
            status: 'generated',
            totalQuestions,
            generatedReason: 'session_followup',
          },
        });
      }
    });
  }

  private resolveSessionScore(session: {
    overallScore: unknown;
    fluencyScore: unknown;
    pronunciationScore: unknown;
    grammarScore: unknown;
  }): number {
    const overall = this.toNumber(session.overallScore);
    if (overall !== null) {
      return this.clampScore(overall);
    }

    const parts = [
      this.toNumber(session.fluencyScore),
      this.toNumber(session.pronunciationScore),
      this.toNumber(session.grammarScore),
    ].filter((value): value is number => value !== null);

    if (parts.length === 0) {
      return 50;
    }

    const avg = parts.reduce((sum, value) => sum + value, 0) / parts.length;
    return this.clampScore(avg);
  }

  private detectWeakestCategory(
    feedback: Array<{ feedbackType: string; severity: string }>,
  ): string | null {
    if (feedback.length === 0) {
      return null;
    }

    const severityWeight: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

    const scores: Record<string, number> = {};
    for (const item of feedback) {
      const weight = severityWeight[item.severity] ?? 1;
      scores[item.feedbackType] = (scores[item.feedbackType] ?? 0) + weight;
    }

    let topType: string | null = null;
    let topScore = -1;

    for (const [type, value] of Object.entries(scores)) {
      if (value > topScore) {
        topType = type;
        topScore = value;
      }
    }

    return topType;
  }

  private computeFollowUpQuestionCount(
    score: number,
    feedbackCount: number,
  ): number {
    let total = 5 + Math.min(feedbackCount, 4);

    if (score < 50) {
      total += 2;
    } else if (score < 70) {
      total += 1;
    }

    return Math.max(5, Math.min(total, 12));
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private clampScore(value: number): number {
    return this.roundTwoDecimals(Math.max(0, Math.min(value, 100)));
  }

  private roundTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
