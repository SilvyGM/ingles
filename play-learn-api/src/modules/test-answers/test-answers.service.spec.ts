import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockAnswer = {
  id: 'answer-uuid-1234',
  generatedTestId: 'test-uuid-1234',
  questionId: 'question-uuid-1234',
  userAnswer: 'is',
  isCorrect: true,
  feedbackText: 'Correct!',
  answeredAt: new Date(),
};

describe('TestAnswersService', () => {
  let service: TestAnswersService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestAnswersService,
        {
          provide: PrismaService,
          useValue: {
            testAnswer: {
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

    service = module.get<TestAnswersService>(TestAnswersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear una respuesta de test', async () => {
      (prisma.testAnswer.create as jest.Mock).mockResolvedValue(mockAnswer);

      const dto = {
        generatedTestId: 'test-uuid-1234',
        questionId: 'question-uuid-1234',
        userAnswer: 'is',
        isCorrect: true,
      };

      const result = await service.create(dto);

      expect(prisma.testAnswer.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ generatedTestId: dto.generatedTestId }),
      });
      expect(result).toEqual(mockAnswer);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las respuestas ordenadas por answeredAt desc', async () => {
      (prisma.testAnswer.findMany as jest.Mock).mockResolvedValue([mockAnswer]);

      const result = await service.findAll();

      expect(prisma.testAnswer.findMany).toHaveBeenCalledWith({
        orderBy: { answeredAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar una respuesta por ID', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(mockAnswer);

      const result = await service.findOne('answer-uuid-1234');

      expect(result).toEqual(mockAnswer);
    });

    it('debería lanzar NotFoundException si la respuesta no existe', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una respuesta existente', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(mockAnswer);
      const updated = { ...mockAnswer, isCorrect: false };
      (prisma.testAnswer.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('answer-uuid-1234', { isCorrect: false });

      expect(result.isCorrect).toBe(false);
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una respuesta existente', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(mockAnswer);
      (prisma.testAnswer.delete as jest.Mock).mockResolvedValue(mockAnswer);

      const result = await service.remove('answer-uuid-1234');

      expect(prisma.testAnswer.delete).toHaveBeenCalledWith({
        where: { id: 'answer-uuid-1234' },
      });
      expect(result).toEqual(mockAnswer);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.testAnswer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
