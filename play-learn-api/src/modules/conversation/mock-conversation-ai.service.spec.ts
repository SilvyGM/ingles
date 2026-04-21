import { Test, TestingModule } from '@nestjs/testing';
import { MockConversationAiService } from './mock-conversation-ai.service';

describe('MockConversationAiService', () => {
  let service: MockConversationAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockConversationAiService],
    }).compile();

    service = module.get<MockConversationAiService>(MockConversationAiService);
  });

  describe('analyzeTurn', () => {
    it('debería detectar problemas de gramática con "i am agree"', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'I am agree with you on this point',
      });

      expect(result.feedbackType).toBe('grammar');
      expect(result.severity).toBe('high');
      expect(result.grammarScore).toBe(55);
    });

    it('debería detectar problemas de vocabulario en mensajes cortos', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'Yes it is',
      });

      expect(result.feedbackType).toBe('vocabulary');
      expect(result.severity).toBe('medium');
    });

    it('debería detectar fluencia cuando el mensaje es suficientemente largo y sin errores', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage:
          'I think the most important thing is to practice every day and be consistent with your studies',
      });

      expect(result.feedbackType).toBe('fluency');
      expect(result.severity).toBe('low');
    });

    it('debería calcular fluencyScore basado en cantidad de palabras', () => {
      const shortResult = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'Yes I do agree with that point here now okay',
      });

      const longResult = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage:
          'Yes I completely agree with that point because it helps learners understand context better through real world examples',
      });

      expect(longResult.fluencyScore).toBeGreaterThanOrEqual(shortResult.fluencyScore);
    });

    it('debería mantener las puntuaciones en el rango 0-100', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage:
          'This is a very long message with many words to test the scoring mechanism in the mock AI service',
        turnIndex: 99,
      });

      expect(result.fluencyScore).toBeGreaterThanOrEqual(0);
      expect(result.fluencyScore).toBeLessThanOrEqual(100);
      expect(result.pronunciationScore).toBeGreaterThanOrEqual(0);
      expect(result.pronunciationScore).toBeLessThanOrEqual(100);
      expect(result.grammarScore).toBeGreaterThanOrEqual(0);
      expect(result.grammarScore).toBeLessThanOrEqual(100);
    });

    it('debería incrementar pronunciationScore con turnIndex más alto', () => {
      const earlyTurn = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'This is my response for the exercise',
        turnIndex: 1,
      });

      const laterTurn = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'This is my response for the exercise',
        turnIndex: 10,
      });

      expect(laterTurn.pronunciationScore).toBeGreaterThan(earlyTurn.pronunciationScore);
    });

    it('debería retornar una estructura LlmAnalysis completa', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'I enjoy learning English every single day',
      });

      expect(result).toHaveProperty('assistantReply');
      expect(result).toHaveProperty('feedbackType');
      expect(result).toHaveProperty('detectedIssue');
      expect(result).toHaveProperty('suggestedCorrection');
      expect(result).toHaveProperty('severity');
      expect(result).toHaveProperty('fluencyScore');
      expect(result).toHaveProperty('pronunciationScore');
      expect(result).toHaveProperty('grammarScore');
    });

    it('debería manejar mensajes vacíos sin errores', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: '',
      });

      expect(result).toBeDefined();
      expect(result.feedbackType).toBe('vocabulary');
    });

    it('debería detectar "he go" como error gramatical', () => {
      const result = service.analyzeTurn({
        sessionId: 'session-uuid',
        userMessage: 'Every morning he go to the gym before work',
      });

      expect(result.feedbackType).toBe('grammar');
      expect(result.severity).toBe('high');
    });
  });
});
