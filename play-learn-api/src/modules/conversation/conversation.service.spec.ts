import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MockConversationAiService } from './mock-conversation-ai.service';
import type { LlmAnalysis } from './conversation.types';

const mockSession = {
  id: 'session-uuid-1234',
  userId: 'user-uuid-1234',
  topicId: 'topic-uuid-1234',
  status: 'started',
};

const mockAnalysis: LlmAnalysis = {
  assistantReply: 'Good attempt!',
  feedbackType: 'grammar',
  detectedIssue: 'Incorrect verb conjugation',
  suggestedCorrection: 'Use "goes" instead of "go"',
  severity: 'high',
  fluencyScore: 70,
  pronunciationScore: 80,
  grammarScore: 55,
};

describe('ConversationService', () => {
  let service: ConversationService;
  let prisma: jest.Mocked<PrismaService>;
  let mockAiService: jest.Mocked<MockConversationAiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: PrismaService,
          useValue: {
            conversationSession: {
              findUnique: jest.fn(),
            },
            conversationFeedback: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: MockConversationAiService,
          useValue: {
            analyzeTurn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    prisma = module.get(PrismaService);
    mockAiService = module.get(MockConversationAiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.USE_MOCK_AI;
  });

  describe('analyzeTurn', () => {
    const dto = {
      sessionId: 'session-uuid-1234',
      userMessage: 'I am agree with the answer because it is correct',
      topicName: 'Daily Routines',
      learnerLevel: 'B1',
      turnIndex: 2,
    };

    it('debería analizar un turno con el servicio mock cuando USE_MOCK_AI=true', async () => {
      process.env.USE_MOCK_AI = 'true';
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      mockAiService.analyzeTurn.mockReturnValue(mockAnalysis);
      (prisma.conversationFeedback.create as jest.Mock).mockResolvedValue({});

      const result = await service.analyzeTurn(dto);

      expect(prisma.conversationSession.findUnique).toHaveBeenCalledWith({
        where: { id: dto.sessionId },
      });
      expect(mockAiService.analyzeTurn).toHaveBeenCalledWith(dto);
      expect(prisma.conversationFeedback.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        feedbackType: expect.any(String),
        detectedIssue: expect.any(String),
        severity: expect.any(String),
      });
    });

    it('debería lanzar InternalServerErrorException cuando la sesión no existe', async () => {
      process.env.USE_MOCK_AI = 'true';
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.analyzeTurn(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('debería guardar el feedback en la base de datos después del análisis', async () => {
      process.env.USE_MOCK_AI = 'true';
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      mockAiService.analyzeTurn.mockReturnValue(mockAnalysis);
      (prisma.conversationFeedback.create as jest.Mock).mockResolvedValue({});

      await service.analyzeTurn(dto);

      expect(prisma.conversationFeedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          sessionId: dto.sessionId,
          sourceFragment: dto.userMessage,
        }),
      });
    });

    it('debería normalizar las puntuaciones al rango 0-100', async () => {
      process.env.USE_MOCK_AI = 'true';
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      const excessiveAnalysis: LlmAnalysis = {
        ...mockAnalysis,
        fluencyScore: 150,
        pronunciationScore: -20,
        grammarScore: 50,
      };
      mockAiService.analyzeTurn.mockReturnValue(excessiveAnalysis);
      (prisma.conversationFeedback.create as jest.Mock).mockResolvedValue({});

      const result = await service.analyzeTurn(dto);

      expect(result.fluencyScore).toBeLessThanOrEqual(100);
      expect(result.pronunciationScore).toBeGreaterThanOrEqual(0);
    });

    it('debería normalizar feedbackType inválido al primer valor válido', async () => {
      process.env.USE_MOCK_AI = 'true';
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      const invalidAnalysis: LlmAnalysis = {
        ...mockAnalysis,
        feedbackType: 'invalid_type',
        severity: 'invalid_severity',
      };
      mockAiService.analyzeTurn.mockReturnValue(invalidAnalysis);
      (prisma.conversationFeedback.create as jest.Mock).mockResolvedValue({});

      const result = await service.analyzeTurn(dto);

      expect(['grammar', 'pronunciation', 'fluency', 'vocabulary', 'semantic']).toContain(
        result.feedbackType,
      );
      expect(['low', 'medium', 'high']).toContain(result.severity);
    });
  });
});
