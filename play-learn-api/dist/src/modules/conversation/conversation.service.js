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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const domain_constants_1 = require("../../common/constants/domain.constants");
const prisma_service_1 = require("../../prisma/prisma.service");
const mock_conversation_ai_service_1 = require("./mock-conversation-ai.service");
let ConversationService = class ConversationService {
    prisma;
    mockConversationAiService;
    constructor(prisma, mockConversationAiService) {
        this.prisma = prisma;
        this.mockConversationAiService = mockConversationAiService;
    }
    async analyzeTurn(analyzeTurnDto) {
        const useMockAi = this.isTrueEnv(process.env.USE_MOCK_AI);
        const session = await this.prisma.conversationSession.findUnique({
            where: { id: analyzeTurnDto.sessionId },
        });
        if (!session) {
            throw new common_1.InternalServerErrorException('Sesion no encontrada para analizar turno.');
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
    async analyzeTurnWithProvider(analyzeTurnDto) {
        const apiKey = process.env.OPENAI_API_KEY;
        const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
        const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
        const isLocalProvider = this.isLocalBaseUrl(baseUrl);
        if (!apiKey && !isLocalProvider) {
            throw new common_1.ServiceUnavailableException('OPENAI_API_KEY no configurada. Define una key para proveedor cloud o usa OPENAI_BASE_URL local (Ollama/LM Studio).');
        }
        const headers = {
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
                        content: 'You are an English speaking coach for language learners. Return ONLY valid JSON with keys: assistantReply, feedbackType, detectedIssue, suggestedCorrection, severity, fluencyScore, pronunciationScore, grammarScore. feedbackType must be one of grammar|pronunciation|fluency|vocabulary|semantic. severity must be one of low|medium|high. Scores are numbers from 0 to 100.',
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
            throw new common_1.ServiceUnavailableException(`Fallo proveedor IA: ${response.status} ${raw}`);
        }
        const completion = (await response.json());
        const content = completion.choices?.[0]?.message?.content;
        if (!content) {
            throw new common_1.InternalServerErrorException('Respuesta IA vacia al analizar turno.');
        }
        return this.parseAnalysis(content);
    }
    buildPrompt(dto) {
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
    parseAnalysis(raw) {
        try {
            return JSON.parse(raw);
        }
        catch {
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) {
                throw new common_1.InternalServerErrorException('No se pudo parsear JSON de respuesta IA.');
            }
            return JSON.parse(match[0]);
        }
    }
    normalizeAnalysis(input) {
        const feedbackType = domain_constants_1.FEEDBACK_TYPES.includes(input.feedbackType)
            ? input.feedbackType
            : 'grammar';
        const severity = domain_constants_1.SEVERITY_LEVELS.includes(input.severity)
            ? input.severity
            : 'medium';
        return {
            assistantReply: input.assistantReply?.trim() || 'Thanks, can you expand your answer a little more?',
            feedbackType,
            detectedIssue: input.detectedIssue?.trim() ||
                'Respuesta con potencial de mejora en precision linguistica.',
            suggestedCorrection: input.suggestedCorrection?.trim() ||
                'Intenta usar una frase mas completa con conectores.',
            severity,
            fluencyScore: this.clampScore(input.fluencyScore),
            pronunciationScore: this.clampScore(input.pronunciationScore),
            grammarScore: this.clampScore(input.grammarScore),
        };
    }
    clampScore(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 60;
        }
        return Math.max(0, Math.min(100, Math.round(numeric)));
    }
    isLocalBaseUrl(baseUrl) {
        try {
            const parsed = new URL(baseUrl);
            return ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname);
        }
        catch {
            return false;
        }
    }
    isTrueEnv(value) {
        return value?.trim().toLowerCase() === 'true';
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mock_conversation_ai_service_1.MockConversationAiService])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map