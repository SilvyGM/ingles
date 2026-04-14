import { Injectable } from '@nestjs/common';
import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import type { LlmAnalysis } from './conversation.types';

@Injectable()
export class MockConversationAiService {
  analyzeTurn(dto: AnalyzeTurnDto): LlmAnalysis {
    const message = dto.userMessage?.trim() ?? '';
    const words = message.split(/\s+/).filter(Boolean);

    const hasGrammarIssue = /\bi am agree\b|\bhe go\b|\bshe go\b/i.test(message);
    const hasVocabularyIssue = words.length < 8;

    const feedbackType = hasGrammarIssue
      ? 'grammar'
      : hasVocabularyIssue
        ? 'vocabulary'
        : 'fluency';

    const detectedIssue = hasGrammarIssue
      ? 'Hay una estructura gramatical incorrecta en la respuesta.'
      : hasVocabularyIssue
        ? 'La respuesta es valida pero muy corta para mostrar dominio.'
        : 'La respuesta es comprensible, pero puede sonar mas natural con conectores.';

    const suggestedCorrection = hasGrammarIssue
      ? 'Usa estructuras correctas como: "I agree" o "He goes" segun corresponda.'
      : hasVocabularyIssue
        ? 'Amplia tu respuesta con al menos una razon y un ejemplo concreto.'
        : 'Agrega conectores como "however", "because" o "in addition" para mejorar fluidez.';

    const fluencyScore = this.clamp(45 + words.length * 3);
    const pronunciationScore = this.clamp(68 + (dto.turnIndex ?? 1) * 2);
    const grammarScore = this.clamp(hasGrammarIssue ? 55 : 78);

    return {
      assistantReply:
        'Great effort. Could you expand your answer with one practical detail about your situation?',
      feedbackType,
      detectedIssue,
      suggestedCorrection,
      severity: hasGrammarIssue ? 'high' : hasVocabularyIssue ? 'medium' : 'low',
      fluencyScore,
      pronunciationScore,
      grammarScore,
    };
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
