import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import type { LlmAnalysis } from './conversation.types';
export declare class MockConversationAiService {
    analyzeTurn(dto: AnalyzeTurnDto): LlmAnalysis;
    private clamp;
}
