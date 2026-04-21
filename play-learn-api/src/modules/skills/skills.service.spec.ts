import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockSkill = {
  id: 'skill-uuid-1234',
  code: 'GRAM_VERB',
  name: 'Verb Conjugation',
  category: 'grammar',
  description: 'Understanding verb conjugation in English',
  isActive: true,
  createdAt: new Date(),
};

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: {
            skill: {
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

    service = module.get<SkillsService>(SkillsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear una habilidad', async () => {
      (prisma.skill.create as jest.Mock).mockResolvedValue(mockSkill);

      const dto = {
        code: 'GRAM_VERB',
        name: 'Verb Conjugation',
        category: 'grammar',
      };

      const result = await service.create(dto);

      expect(prisma.skill.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ code: dto.code }),
      });
      expect(result).toEqual(mockSkill);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las habilidades ordenadas por nombre asc', async () => {
      (prisma.skill.findMany as jest.Mock).mockResolvedValue([mockSkill]);

      const result = await service.findAll();

      expect(prisma.skill.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar una habilidad por ID', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(mockSkill);

      const result = await service.findOne('skill-uuid-1234');

      expect(result).toEqual(mockSkill);
    });

    it('debería lanzar NotFoundException si la habilidad no existe', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una habilidad existente', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(mockSkill);
      const updated = { ...mockSkill, isActive: false };
      (prisma.skill.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('skill-uuid-1234', { isActive: false });

      expect(result.isActive).toBe(false);
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una habilidad existente', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.skill.delete as jest.Mock).mockResolvedValue(mockSkill);

      const result = await service.remove('skill-uuid-1234');

      expect(prisma.skill.delete).toHaveBeenCalledWith({
        where: { id: 'skill-uuid-1234' },
      });
      expect(result).toEqual(mockSkill);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.skill.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
