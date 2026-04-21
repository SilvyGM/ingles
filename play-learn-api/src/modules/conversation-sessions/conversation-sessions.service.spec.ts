import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConversationSessionsService } from './conversation-sessions.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockSession = {
  id: 'session-uuid-1234',
  userId: 'user-uuid-1234',
  topicId: 'topic-uuid-1234',
  status: 'started',
  feedback: [],
  generatedTests: [],
  fluencyScore: null,
  pronunciationScore: null,
  grammarScore: null,
  overallScore: null,
  createdAt: new Date(),
};

const mockCompletedSession = {
  ...mockSession,
  status: 'completed',
  overallScore: 75,
  feedback: [
    { feedbackType: 'grammar', severity: 'high' },
    { feedbackType: 'grammar', severity: 'medium' },
    { feedbackType: 'fluency', severity: 'low' },
  ],
};

const mockSkill = {
  id: 'skill-uuid-1234',
  category: 'grammar',
  name: 'Grammar Basics',
  isActive: true,
};

describe('ConversationSessionsService', () => {
  let service: ConversationSessionsService;
  let prisma: jest.Mocked<PrismaService>;
  let txMock: any;

  beforeEach(async () => {
    txMock = {
      skillProgress: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      generatedTest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationSessionsService,
        {
          provide: PrismaService,
          useValue: {
            conversationSession: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            skill: {
              findFirst: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConversationSessionsService>(ConversationSessionsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una sesión en estado "started"', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockSession);

      const dto = {
        userId: 'user-uuid-1234',
        topicId: 'topic-uuid-1234',
      };

      const result = await service.create(dto);

      expect(prisma.conversationSession.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: dto.userId,
          topicId: dto.topicId,
        }),
      });
      expect(result).toEqual(mockSession);
    });

    it('debería aplicar reglas de completitud cuando la sesión se crea como "completed"', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(txMock));
      txMock.skillProgress.findFirst.mockResolvedValue(null);
      txMock.generatedTest.findFirst.mockResolvedValue(null);
      txMock.skillProgress.create.mockResolvedValue({});
      txMock.generatedTest.create.mockResolvedValue({});

      const dto = {
        userId: 'user-uuid-1234',
        topicId: 'topic-uuid-1234',
        status: 'completed',
        overallScore: 75,
      };

      const result = await service.create(dto);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.status).toBe('completed');
    });

    it('NO debería aplicar reglas de completitud cuando la sesión se crea como "started"', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockSession);

      const dto = {
        userId: 'user-uuid-1234',
        topicId: 'topic-uuid-1234',
        status: 'started',
      };

      await service.create(dto);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las sesiones con feedback incluido', async () => {
      (prisma.conversationSession.findMany as jest.Mock).mockResolvedValue([mockSession]);

      const result = await service.findAll();

      expect(prisma.conversationSession.findMany).toHaveBeenCalledWith({
        include: { feedback: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar una sesión con feedback y tests generados', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.findOne('session-uuid-1234');

      expect(prisma.conversationSession.findUnique).toHaveBeenCalledWith({
        where: { id: 'session-uuid-1234' },
        include: { feedback: true, generatedTests: true },
      });
      expect(result).toEqual(mockSession);
    });

    it('debería lanzar NotFoundException si la sesión no existe', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una sesión existente', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      const updatedSession = { ...mockSession, status: 'processing' };
      (prisma.conversationSession.update as jest.Mock).mockResolvedValue(updatedSession);

      const result = await service.update('session-uuid-1234', { status: 'processing' });

      expect(result.status).toBe('processing');
    });

    it('debería aplicar reglas de completitud al transicionar de "started" a "completed"', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prisma.conversationSession.update as jest.Mock).mockResolvedValue(mockCompletedSession);

      // Segunda llamada para applySessionCompletionRules
      (prisma.conversationSession.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValue(mockCompletedSession);

      (prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(txMock));
      txMock.skillProgress.findFirst.mockResolvedValue(null);
      txMock.generatedTest.findFirst.mockResolvedValue(null);
      txMock.skillProgress.create.mockResolvedValue({});
      txMock.generatedTest.create.mockResolvedValue({});

      const result = await service.update('session-uuid-1234', { status: 'completed' });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.status).toBe('completed');
    });

    it('NO debería aplicar reglas si ya estaba completada', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.conversationSession.update as jest.Mock).mockResolvedValue(mockCompletedSession);

      await service.update('session-uuid-1234', { overallScore: 80 });

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException al actualizar ID inexistente', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('non-existent-id', { status: 'processing' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una sesión existente', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prisma.conversationSession.delete as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.remove('session-uuid-1234');

      expect(prisma.conversationSession.delete).toHaveBeenCalledWith({
        where: { id: 'session-uuid-1234' },
      });
      expect(result).toEqual(mockSession);
    });

    it('debería lanzar NotFoundException al eliminar ID inexistente', async () => {
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('applySessionCompletionRules (comportamiento interno)', () => {
    it('debería combinar masteryLevel con fórmula 70/30 cuando ya existe progreso', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockCompletedSession);

      const sessionWithProgress = {
        ...mockCompletedSession,
        feedback: [{ feedbackType: 'grammar', severity: 'high' }],
      };
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(sessionWithProgress);
      (prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(txMock));

      const existingProgress = { id: 'progress-uuid', masteryLevel: 60 };
      txMock.skillProgress.findFirst.mockResolvedValue(existingProgress);
      txMock.skillProgress.update.mockResolvedValue({});
      txMock.generatedTest.findFirst.mockResolvedValue(null);
      txMock.generatedTest.create.mockResolvedValue({});

      await service.create({ userId: 'user-uuid', topicId: 'topic-uuid', status: 'completed', overallScore: 80 });

      expect(txMock.skillProgress.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            masteryLevel: expect.closeTo(60 * 0.7 + 75 * 0.3, 1), // 80 is overall score but session resolves to 75
          }),
        }),
      );
    });

    it('debería crear nuevo SkillProgress si no existe previo', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(txMock));
      txMock.skillProgress.findFirst.mockResolvedValue(null);
      txMock.skillProgress.create.mockResolvedValue({});
      txMock.generatedTest.findFirst.mockResolvedValue(null);
      txMock.generatedTest.create.mockResolvedValue({});

      await service.create({ userId: 'user-uuid', topicId: 'topic-uuid', status: 'completed' });

      expect(txMock.skillProgress.create).toHaveBeenCalled();
    });

    it('NO debería crear GeneratedTest si ya existe uno para la sesión', async () => {
      (prisma.conversationSession.create as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.conversationSession.findUnique as jest.Mock).mockResolvedValue(mockCompletedSession);
      (prisma.skill.findFirst as jest.Mock).mockResolvedValue(mockSkill);
      (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(txMock));
      txMock.skillProgress.findFirst.mockResolvedValue(null);
      txMock.skillProgress.create.mockResolvedValue({});
      txMock.generatedTest.findFirst.mockResolvedValue({ id: 'existing-test' });

      await service.create({ userId: 'user-uuid', topicId: 'topic-uuid', status: 'completed' });

      expect(txMock.generatedTest.create).not.toHaveBeenCalled();
    });
  });
});
