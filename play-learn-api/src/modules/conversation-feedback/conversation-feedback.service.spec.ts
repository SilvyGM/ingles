import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConversationFeedbackService } from './conversation-feedback.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockFeedback = {
  id: 'feedback-uuid-1234',
  sessionId: 'session-uuid-1234',
  feedbackType: 'grammar',
  sourceFragment: 'I am agree',
  detectedIssue: 'Incorrect grammar structure',
  suggestedCorrection: 'Use "I agree" instead',
  severity: 'high',
  createdAt: new Date(),
};

describe('ConversationFeedbackService', () => {
  let service: ConversationFeedbackService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationFeedbackService,
        {
          provide: PrismaService,
          useValue: {
            conversationFeedback: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ConversationFeedbackService>(ConversationFeedbackService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un feedback de conversación', async () => {
      (prisma.conversationFeedback.create as jest.Mock).mockResolvedValue(mockFeedback);

      const dto = {
        sessionId: 'session-uuid-1234',
        feedbackType: 'grammar',
        detectedIssue: 'Incorrect grammar structure',
        severity: 'high',
      };

      const result = await service.create(dto);

      expect(prisma.conversationFeedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ sessionId: dto.sessionId }),
      });
      expect(result).toEqual(mockFeedback);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los feedbacks ordenados por createdAt desc', async () => {
      (prisma.conversationFeedback.findMany as jest.Mock).mockResolvedValue([mockFeedback]);

      const result = await service.findAll();

      expect(prisma.conversationFeedback.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockFeedback);
    });

    it('debería retornar array vacío si no hay feedbacks', async () => {
      (prisma.conversationFeedback.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debería retornar un feedback por ID', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(mockFeedback);

      const result = await service.findOne('feedback-uuid-1234');

      expect(prisma.conversationFeedback.findUnique).toHaveBeenCalledWith({
        where: { id: 'feedback-uuid-1234' },
      });
      expect(result).toEqual(mockFeedback);
    });

    it('debería lanzar NotFoundException si el feedback no existe', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un feedback existente', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(mockFeedback);
      const updatedFeedback = { ...mockFeedback, severity: 'medium' };
      (prisma.conversationFeedback.update as jest.Mock).mockResolvedValue(updatedFeedback);

      const result = await service.update('feedback-uuid-1234', { severity: 'medium' });

      expect(prisma.conversationFeedback.update).toHaveBeenCalledWith({
        where: { id: 'feedback-uuid-1234' },
        data: expect.objectContaining({ severity: 'medium' }),
      });
      expect(result.severity).toBe('medium');
    });

    it('debería lanzar NotFoundException al actualizar un ID inexistente', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', { severity: 'low' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar un feedback existente', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(mockFeedback);
      (prisma.conversationFeedback.delete as jest.Mock).mockResolvedValue(mockFeedback);

      const result = await service.remove('feedback-uuid-1234');

      expect(prisma.conversationFeedback.delete).toHaveBeenCalledWith({
        where: { id: 'feedback-uuid-1234' },
      });
      expect(result).toEqual(mockFeedback);
    });

    it('debería lanzar NotFoundException al eliminar un ID inexistente', async () => {
      (prisma.conversationFeedback.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
