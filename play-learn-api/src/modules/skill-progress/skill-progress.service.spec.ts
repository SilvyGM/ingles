import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SkillProgressService } from './skill-progress.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockProgress = {
  id: 'progress-uuid-1234',
  userId: 'user-uuid-1234',
  skillId: 'skill-uuid-1234',
  topicId: 'topic-uuid-1234',
  masteryLevel: 65,
  lastScore: 70,
  lastPracticedAt: new Date(),
  updatedAt: new Date(),
};

describe('SkillProgressService', () => {
  let service: SkillProgressService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillProgressService,
        {
          provide: PrismaService,
          useValue: {
            skillProgress: {
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

    service = module.get<SkillProgressService>(SkillProgressService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear un registro de progreso de habilidad', async () => {
      (prisma.skillProgress.create as jest.Mock).mockResolvedValue(mockProgress);

      const dto = {
        userId: 'user-uuid-1234',
        skillId: 'skill-uuid-1234',
        masteryLevel: 65,
      };

      const result = await service.create(dto);

      expect(prisma.skillProgress.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: dto.userId }),
      });
      expect(result).toEqual(mockProgress);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los progresos ordenados por updatedAt desc', async () => {
      (prisma.skillProgress.findMany as jest.Mock).mockResolvedValue([mockProgress]);

      const result = await service.findAll();

      expect(prisma.skillProgress.findMany).toHaveBeenCalledWith({
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar un progreso por ID', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(mockProgress);

      const result = await service.findOne('progress-uuid-1234');

      expect(result).toEqual(mockProgress);
    });

    it('debería lanzar NotFoundException si el progreso no existe', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un progreso existente', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(mockProgress);
      const updated = { ...mockProgress, masteryLevel: 80 };
      (prisma.skillProgress.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('progress-uuid-1234', { masteryLevel: 80 });

      expect(result.masteryLevel).toBe(80);
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un progreso existente', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(mockProgress);
      (prisma.skillProgress.delete as jest.Mock).mockResolvedValue(mockProgress);

      const result = await service.remove('progress-uuid-1234');

      expect(prisma.skillProgress.delete).toHaveBeenCalledWith({
        where: { id: 'progress-uuid-1234' },
      });
      expect(result).toEqual(mockProgress);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.skillProgress.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
