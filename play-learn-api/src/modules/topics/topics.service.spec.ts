import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockTopic = {
  id: 'topic-uuid-1234',
  name: 'Daily Routines',
  slug: 'daily-routines',
  category: 'everyday-english',
  difficultyLevel: 'A2',
  isActive: true,
  createdAt: new Date(),
};

describe('TopicsService', () => {
  let service: TopicsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: PrismaService,
          useValue: {
            topic: {
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

    service = module.get<TopicsService>(TopicsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear un tópico', async () => {
      (prisma.topic.create as jest.Mock).mockResolvedValue(mockTopic);

      const dto = {
        name: 'Daily Routines',
        slug: 'daily-routines',
        category: 'everyday-english',
        difficultyLevel: 'A2',
      };

      const result = await service.create(dto);

      expect(prisma.topic.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: dto.slug }),
      });
      expect(result).toEqual(mockTopic);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los tópicos ordenados por createdAt desc', async () => {
      (prisma.topic.findMany as jest.Mock).mockResolvedValue([mockTopic]);

      const result = await service.findAll();

      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar un tópico por ID', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(mockTopic);

      const result = await service.findOne('topic-uuid-1234');

      expect(result).toEqual(mockTopic);
    });

    it('debería lanzar NotFoundException si el tópico no existe', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un tópico existente', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(mockTopic);
      const updated = { ...mockTopic, difficultyLevel: 'B1' };
      (prisma.topic.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('topic-uuid-1234', { difficultyLevel: 'B1' });

      expect(result.difficultyLevel).toBe('B1');
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un tópico existente', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(mockTopic);
      (prisma.topic.delete as jest.Mock).mockResolvedValue(mockTopic);

      const result = await service.remove('topic-uuid-1234');

      expect(prisma.topic.delete).toHaveBeenCalledWith({
        where: { id: 'topic-uuid-1234' },
      });
      expect(result).toEqual(mockTopic);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
