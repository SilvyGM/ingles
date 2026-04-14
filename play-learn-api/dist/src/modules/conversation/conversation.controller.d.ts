import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import { ConversationService } from './conversation.service';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
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
}
