import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GeneratedTestsService } from './generated-tests.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockTest = {
  id: 'test-uuid-1234',
  userId: 'user-uuid-1234',
  topicId: 'topic-uuid-1234',
  sourceSessionId: null,
  status: 'generated',
  totalQuestions: 5,
  score: null,
  generatedReason: 'session_followup',
  submittedAt: null,
  testAnswers: [],
  createdAt: new Date(),
};

describe('GeneratedTestsService', () => {
  let service: GeneratedTestsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratedTestsService,
        {
          provide: PrismaService,
          useValue: {
            generatedTest: {
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

    service = module.get<GeneratedTestsService>(GeneratedTestsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear un test generado', async () => {
      (prisma.generatedTest.create as jest.Mock).mockResolvedValue(mockTest);

      const dto = {
        userId: 'user-uuid-1234',
        generatedReason: 'session_followup',
      };

      const result = await service.create(dto);

      expect(prisma.generatedTest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: dto.userId }),
      });
      expect(result).toEqual(mockTest);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los tests con testAnswers incluidos', async () => {
      (prisma.generatedTest.findMany as jest.Mock).mockResolvedValue([mockTest]);

      const result = await service.findAll();

      expect(prisma.generatedTest.findMany).toHaveBeenCalledWith({
        include: { testAnswers: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar un test por ID con testAnswers', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.findOne('test-uuid-1234');

      expect(prisma.generatedTest.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-uuid-1234' },
        include: { testAnswers: true },
      });
      expect(result).toEqual(mockTest);
    });

    it('debería lanzar NotFoundException si el test no existe', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un test existente', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(mockTest);
      const updated = { ...mockTest, status: 'in_progress' };
      (prisma.generatedTest.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('test-uuid-1234', { status: 'in_progress' });

      expect(result.status).toBe('in_progress');
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un test existente', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(mockTest);
      (prisma.generatedTest.delete as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.remove('test-uuid-1234');

      expect(prisma.generatedTest.delete).toHaveBeenCalledWith({
        where: { id: 'test-uuid-1234' },
      });
      expect(result).toEqual(mockTest);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.generatedTest.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
