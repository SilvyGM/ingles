import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockQuestion = {
  id: 'question-uuid-1234',
  topicId: 'topic-uuid-1234',
  skillId: 'skill-uuid-1234',
  questionType: 'multiple_choice',
  promptText: 'Choose the correct form of the verb "to be"',
  correctAnswer: 'is',
  difficultyLevel: 'A2',
  explanationText: 'Third person singular uses "is"',
  isActive: true,
  createdAt: new Date(),
};

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: {
            question: {
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

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear una pregunta', async () => {
      (prisma.question.create as jest.Mock).mockResolvedValue(mockQuestion);

      const dto = {
        topicId: 'topic-uuid-1234',
        skillId: 'skill-uuid-1234',
        questionType: 'multiple_choice',
        promptText: 'Choose the correct form of the verb "to be"',
        correctAnswer: 'is',
        difficultyLevel: 'A2',
      };

      const result = await service.create(dto);

      expect(prisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ topicId: dto.topicId }),
      });
      expect(result).toEqual(mockQuestion);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las preguntas ordenadas por createdAt desc', async () => {
      (prisma.question.findMany as jest.Mock).mockResolvedValue([mockQuestion]);

      const result = await service.findAll();

      expect(prisma.question.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar una pregunta por ID', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await service.findOne('question-uuid-1234');

      expect(result).toEqual(mockQuestion);
    });

    it('debería lanzar NotFoundException si la pregunta no existe', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una pregunta existente', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(mockQuestion);
      const updated = { ...mockQuestion, difficultyLevel: 'B1' };
      (prisma.question.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('question-uuid-1234', { difficultyLevel: 'B1' });

      expect(result.difficultyLevel).toBe('B1');
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una pregunta existente', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(mockQuestion);
      (prisma.question.delete as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await service.remove('question-uuid-1234');

      expect(prisma.question.delete).toHaveBeenCalledWith({
        where: { id: 'question-uuid-1234' },
      });
      expect(result).toEqual(mockQuestion);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.question.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
