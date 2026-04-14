"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSessionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConversationSessionsService = class ConversationSessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createConversationSessionDto) {
        const session = await this.prisma.conversationSession.create({
            data: {
                userId: createConversationSessionDto.userId,
                topicId: createConversationSessionDto.topicId,
                status: createConversationSessionDto.status ??
                    client_1.SessionStatus.started,
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
        if (session.status === client_1.SessionStatus.completed) {
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
    async findOne(id) {
        const session = await this.prisma.conversationSession.findUnique({
            where: { id },
            include: { feedback: true, generatedTests: true },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Conversation session ${id} not found`);
        }
        return session;
    }
    async update(id, updateConversationSessionDto) {
        const previous = await this.findOne(id);
        const updated = await this.prisma.conversationSession.update({
            where: { id },
            data: {
                userId: updateConversationSessionDto.userId,
                topicId: updateConversationSessionDto.topicId,
                status: updateConversationSessionDto.status,
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
        const movedToCompleted = previous.status !== client_1.SessionStatus.completed &&
            updated.status === client_1.SessionStatus.completed;
        if (movedToCompleted) {
            await this.applySessionCompletionRules(updated.id);
        }
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.conversationSession.delete({ where: { id } });
    }
    async applySessionCompletionRules(sessionId) {
        const session = await this.prisma.conversationSession.findUnique({
            where: { id: sessionId },
            include: { feedback: true },
        });
        if (!session) {
            return;
        }
        const score = this.resolveSessionScore(session);
        const weakestCategory = this.detectWeakestCategory(session.feedback);
        const targetSkill = (weakestCategory &&
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
        const totalQuestions = this.computeFollowUpQuestionCount(score, session.feedback.length);
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
                const blendedMastery = this.roundTwoDecimals(previousMastery * 0.7 + score * 0.3);
                await tx.skillProgress.update({
                    where: { id: existingProgress.id },
                    data: {
                        masteryLevel: blendedMastery,
                        lastScore: score,
                        lastPracticedAt: now,
                    },
                });
            }
            else {
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
    resolveSessionScore(session) {
        const overall = this.toNumber(session.overallScore);
        if (overall !== null) {
            return this.clampScore(overall);
        }
        const parts = [
            this.toNumber(session.fluencyScore),
            this.toNumber(session.pronunciationScore),
            this.toNumber(session.grammarScore),
        ].filter((value) => value !== null);
        if (parts.length === 0) {
            return 50;
        }
        const avg = parts.reduce((sum, value) => sum + value, 0) / parts.length;
        return this.clampScore(avg);
    }
    detectWeakestCategory(feedback) {
        if (feedback.length === 0) {
            return null;
        }
        const severityWeight = {
            low: 1,
            medium: 2,
            high: 3,
        };
        const scores = {};
        for (const item of feedback) {
            const weight = severityWeight[item.severity] ?? 1;
            scores[item.feedbackType] = (scores[item.feedbackType] ?? 0) + weight;
        }
        let topType = null;
        let topScore = -1;
        for (const [type, value] of Object.entries(scores)) {
            if (value > topScore) {
                topType = type;
                topScore = value;
            }
        }
        return topType;
    }
    computeFollowUpQuestionCount(score, feedbackCount) {
        let total = 5 + Math.min(feedbackCount, 4);
        if (score < 50) {
            total += 2;
        }
        else if (score < 70) {
            total += 1;
        }
        return Math.max(5, Math.min(total, 12));
    }
    toNumber(value) {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    clampScore(value) {
        return this.roundTwoDecimals(Math.max(0, Math.min(value, 100)));
    }
    roundTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }
};
exports.ConversationSessionsService = ConversationSessionsService;
exports.ConversationSessionsService = ConversationSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationSessionsService);
//# sourceMappingURL=conversation-sessions.service.js.map