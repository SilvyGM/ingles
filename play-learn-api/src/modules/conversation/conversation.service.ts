import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  FEEDBACK_TYPES,
  SEVERITY_LEVELS,
} from '../../common/constants/domain.constants';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import { MockConversationAiService } from './mock-conversation-ai.service';
import type { LlmAnalysis } from './conversation.types';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mockConversationAiService: MockConversationAiService,
  ) {}

  async analyzeTurn(analyzeTurnDto: AnalyzeTurnDto) {
    const useMockAi = this.isTrueEnv(process.env.USE_MOCK_AI);

    const session = await this.prisma.conversationSession.findUnique({
      where: { id: analyzeTurnDto.sessionId },
    });

    if (!session) {
      throw new InternalServerErrorException('Sesion no encontrada para analizar turno.');
    }

    const analysis = useMockAi
      ? this.mockConversationAiService.analyzeTurn(analyzeTurnDto)
      : await this.analyzeTurnWithProvider(analyzeTurnDto);

    const normalized = this.normalizeAnalysis(analysis);

    await this.prisma.conversationFeedback.create({
      data: {
        sessionId: analyzeTurnDto.sessionId,
        feedbackType: normalized.feedbackType,
        sourceFragment: analyzeTurnDto.userMessage,
        detectedIssue: normalized.detectedIssue,
        suggestedCorrection: normalized.suggestedCorrection,
        severity: normalized.severity,
      },
    });

    return normalized;
  }

  private async analyzeTurnWithProvider(analyzeTurnDto: AnalyzeTurnDto): Promise<LlmAnalysis> {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
    const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
    const isLocalProvider = this.isLocalBaseUrl(baseUrl);

    if (!apiKey && !isLocalProvider) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY no configurada. Define una key para proveedor cloud o usa OPENAI_BASE_URL local (Ollama/LM Studio).',
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const userPrompt = this.buildPrompt(analyzeTurnDto);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an English speaking coach for language learners. Return ONLY valid JSON with keys: assistantReply, feedbackType, detectedIssue, suggestedCorrection, severity, fluencyScore, pronunciationScore, grammarScore. feedbackType must be one of grammar|pronunciation|fluency|vocabulary|semantic. severity must be one of low|medium|high. Scores are numbers from 0 to 100.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new ServiceUnavailableException(`Fallo proveedor IA: ${response.status} ${raw}`);
    }

    const completion = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new InternalServerErrorException('Respuesta IA vacia al analizar turno.');
    }

    return this.parseAnalysis(content);
  }

  private buildPrompt(dto: AnalyzeTurnDto): string {
    const transcript = (dto.transcript ?? []).join('\n');

    return [
      `Topic: ${dto.topicName ?? 'general conversation'}`,
      `Learner level: ${dto.learnerLevel ?? 'A2'}`,
      `Turn: ${dto.turnIndex ?? 1}`,
      'Conversation so far:',
      transcript || 'No previous transcript.',
      'Learner latest message:',
      dto.userMessage,
      'Provide one assistant reply to continue conversation naturally and one concise pedagogical correction.',
    ].join('\n');
  }

  private parseAnalysis(raw: string): LlmAnalysis {
    try {
      return JSON.parse(raw) as LlmAnalysis;
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new InternalServerErrorException('No se pudo parsear JSON de respuesta IA.');
      }
      return JSON.parse(match[0]) as LlmAnalysis;
    }
  }

  private normalizeAnalysis(input: LlmAnalysis) {
    const feedbackType = FEEDBACK_TYPES.includes(input.feedbackType as never)
      ? input.feedbackType
      : 'grammar';

    const severity = SEVERITY_LEVELS.includes(input.severity as never)
      ? input.severity
      : 'medium';

    return {
      assistantReply: input.assistantReply?.trim() || 'Thanks, can you expand your answer a little more?',
      feedbackType,
      detectedIssue:
        input.detectedIssue?.trim() ||
        'Respuesta con potencial de mejora en precision linguistica.',
      suggestedCorrection:
        input.suggestedCorrection?.trim() ||
        'Intenta usar una frase mas completa con conectores.',
      severity,
      fluencyScore: this.clampScore(input.fluencyScore),
      pronunciationScore: this.clampScore(input.pronunciationScore),
      grammarScore: this.clampScore(input.grammarScore),
    };
  }

  private clampScore(value: unknown): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 60;
    }

    return Math.max(0, Math.min(100, Math.round(numeric)));
  }

  private isLocalBaseUrl(baseUrl: string): boolean {
    try {
      const parsed = new URL(baseUrl);
      return ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname);
    } catch {
      return false;
    }
  }

  private isTrueEnv(value: string | undefined): boolean {
    return value?.trim().toLowerCase() === 'true';
  }
}
