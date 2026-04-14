import { PrismaService } from '../../prisma/prisma.service';
import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import { MockConversationAiService } from './mock-conversation-ai.service';
export declare class ConversationService {
    private readonly prisma;
    private readonly mockConversationAiService;
    constructor(prisma: PrismaService, mockConversationAiService: MockConversationAiService);
    analyzeTurn(analyzeTurnDto: AnalyzeTurnDto): Promise<{
        assistantReply: string;
        feedbackType: string;
        detectedIssue: string;
        suggestedCorrection: string;
        severity: string;
        fluencyScore: number;
        pronunciationScore: number;
        grammarScore: number;
    }>;
    private analyzeTurnWithProvider;
    private buildPrompt;
    private parseAnalysis;
    private normalizeAnalysis;
    private clampScore;
    private isLocalBaseUrl;
    private isTrueEnv;
}
