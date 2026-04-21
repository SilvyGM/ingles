import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockUser = {
  id: 'user-uuid-1234',
  email: 'learner@example.com',
  fullName: 'John Doe',
  targetLanguage: 'en',
  currentLevel: 'B1',
  xpTotal: 0,
  currentStreak: 0,
  createdAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
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

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear un usuario con xpTotal y currentStreak en 0 por defecto', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const dto = {
        email: 'learner@example.com',
        fullName: 'John Doe',
        targetLanguage: 'en',
        currentLevel: 'B1',
      };

      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          xpTotal: 0,
          currentStreak: 0,
        }),
      });
      expect(result).toEqual(mockUser);
    });

    it('debería respetar xpTotal y currentStreak personalizados', async () => {
      const userWithXp = { ...mockUser, xpTotal: 500, currentStreak: 7 };
      (prisma.user.create as jest.Mock).mockResolvedValue(userWithXp);

      const dto = {
        email: 'learner@example.com',
        fullName: 'John Doe',
        targetLanguage: 'en',
        currentLevel: 'B1',
        xpTotal: 500,
        currentStreak: 7,
      };

      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ xpTotal: 500, currentStreak: 7 }),
      });
      expect(result.xpTotal).toBe(500);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios ordenados por createdAt desc', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar un usuario por ID', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne('user-uuid-1234');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
      });
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario existente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const updated = { ...mockUser, currentLevel: 'B2', xpTotal: 150 };
      (prisma.user.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('user-uuid-1234', {
        currentLevel: 'B2',
        xpTotal: 150,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        data: expect.objectContaining({ currentLevel: 'B2', xpTotal: 150 }),
      });
      expect(result.currentLevel).toBe('B2');
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario existente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove('user-uuid-1234');

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
      });
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
