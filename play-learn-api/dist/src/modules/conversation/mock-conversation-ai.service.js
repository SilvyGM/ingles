"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockConversationAiService = void 0;
const common_1 = require("@nestjs/common");
let MockConversationAiService = class MockConversationAiService {
    analyzeTurn(dto) {
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
            assistantReply: 'Great effort. Could you expand your answer with one practical detail about your situation?',
            feedbackType,
            detectedIssue,
            suggestedCorrection,
            severity: hasGrammarIssue ? 'high' : hasVocabularyIssue ? 'medium' : 'low',
            fluencyScore,
            pronunciationScore,
            grammarScore,
        };
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
};
exports.MockConversationAiService = MockConversationAiService;
exports.MockConversationAiService = MockConversationAiService = __decorate([
    (0, common_1.Injectable)()
], MockConversationAiService);
//# sourceMappingURL=mock-conversation-ai.service.js.map