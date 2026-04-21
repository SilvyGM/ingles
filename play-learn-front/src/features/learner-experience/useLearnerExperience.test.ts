import { renderHook, act, waitFor } from '@testing-library/react';
import { useLearnerExperience } from '@/features/learner-experience/useLearnerExperience';
import * as api from '@/lib/api';
import * as alerts from '@/lib/alerts';

jest.mock('@/lib/api');
jest.mock('@/lib/alerts', () => ({
  showError: jest.fn().mockResolvedValue(undefined),
  showWarning: jest.fn().mockResolvedValue(undefined),
  showSuccess: jest.fn().mockResolvedValue(undefined),
  showInfo: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/lib/settings', () => ({
  readSettings: jest.fn(() => ({
    baseUrl: 'http://localhost:3000',
    token: 'test-token',
    email: 'user@example.com',
  })),
}));

const mockApiFetch = api.apiFetch as jest.MockedFunction<typeof api.apiFetch>;

const mockTopics = [
  { id: 'topic-1', name: 'Daily Routines', category: 'everyday', difficultyLevel: 'A2' },
  { id: 'topic-2', name: 'Travel', category: 'travel', difficultyLevel: 'B1' },
];

const mockUsers = [
  { id: 'user-1', email: 'user@example.com', fullName: 'Test User', currentLevel: 'B1' },
];

const mockTurnAnalysis = {
  assistantReply: 'Good!',
  feedbackType: 'fluency',
  detectedIssue: 'Minor issue',
  suggestedCorrection: 'Suggestion',
  severity: 'low',
  fluencyScore: 80,
  pronunciationScore: 75,
  grammarScore: 85,
};

function defaultApiMock() {
  mockApiFetch.mockImplementation(async (_settings, endpoint, init) => {
    const method = init?.method ?? 'GET';

    if (endpoint === '/topics' && method === 'GET') return mockTopics as never;
    if (endpoint === '/users' && method === 'GET') return mockUsers as never;
    if (endpoint === '/users' && method === 'POST') return { id: 'user-1' } as never;
    if (endpoint === '/conversation-sessions' && method === 'POST') return { id: 'session-abc' } as never;
    if (endpoint === '/conversation/analyze-turn' && method === 'POST') {
      return mockTurnAnalysis as never;
    }
    if (endpoint.startsWith('/conversation-sessions/') && method === 'PATCH') {
      return null as never;
    }
    if (endpoint === '/generated-tests' && method === 'GET') return [] as never;
    if (endpoint === '/skill-progress' && method === 'GET') return [] as never;

    return [] as never;
  });
}

async function waitForInitialLoad(result: { current: { state: { loading: boolean } } }) {
  await waitFor(() => {
    expect(result.current.state.loading).toBe(false);
  });
}

describe('useLearnerExperience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    defaultApiMock();
  });

  it('debería inicializar con step "setup" y estado de carga', async () => {
    const { result } = renderHook(() => useLearnerExperience());

    expect(result.current.state.step).toBe('setup');
    expect(result.current.state.loading).toBe(true);

    await waitForInitialLoad(result);
  });

  it('debería cargar tópicos y usuario existente al montar', async () => {
    const { result } = renderHook(() => useLearnerExperience());
    await waitForInitialLoad(result);

    expect(result.current.state.topics).toEqual(mockTopics);
    expect(result.current.state.learnerName).toBe('Test User');
    expect(result.current.state.learnerUserId).toBe('user-1');
    expect(result.current.state.loading).toBe(false);
  });

  it('debería preseleccionar el primer tópico', async () => {
    const { result } = renderHook(() => useLearnerExperience());
    await waitForInitialLoad(result);

    expect(result.current.state.selectedTopicId).toBe('topic-1');
  });

  it('debería actualizar selectedTopicId con setSelectedTopicId', async () => {
    const { result } = renderHook(() => useLearnerExperience());
    await waitForInitialLoad(result);

    act(() => {
      result.current.setSelectedTopicId('topic-2');
    });

    expect(result.current.state.selectedTopicId).toBe('topic-2');
  });

  it('debería actualizar learnerName con setLearnerName', async () => {
    const { result } = renderHook(() => useLearnerExperience());
    await waitForInitialLoad(result);

    act(() => {
      result.current.setLearnerName('Nuevo Nombre');
    });

    expect(result.current.state.learnerName).toBe('Nuevo Nombre');
  });

  describe('startPractice', () => {
    it('debería mostrar advertencia si faltan datos', async () => {
      mockApiFetch.mockImplementation(async (_settings, endpoint, init) => {
        const method = init?.method ?? 'GET';
        if (endpoint === '/topics' && method === 'GET') return [] as never;
        if (endpoint === '/users' && method === 'GET') return [] as never;
        return [] as never;
      });

      const { result } = renderHook(() => useLearnerExperience());
      await waitForInitialLoad(result);

      await act(async () => {
        await result.current.startPractice();
      });

      expect(alerts.showWarning).toHaveBeenCalledWith(
        'Datos incompletos',
        expect.any(String),
      );
    });

    it('debería avanzar al step "practice" cuando los datos son correctos', async () => {
      const { result } = renderHook(() => useLearnerExperience());
      await waitForInitialLoad(result);

      act(() => {
        result.current.setLearnerName('Test User');
        result.current.setLearnerEmail('user@example.com');
        result.current.setSelectedTopicId('topic-1');
      });

      await act(async () => {
        await result.current.startPractice();
      });

      expect(result.current.state.step).toBe('practice');
      expect(result.current.state.sessionId).toBe('session-abc');
      expect(alerts.showSuccess).toHaveBeenCalled();
    });
  });

  describe('submitTurn', () => {
    it('debería mostrar advertencia si la respuesta está vacía', async () => {
      const { result } = renderHook(() => useLearnerExperience());
      await waitForInitialLoad(result);

      await act(async () => {
        await result.current.submitTurn();
      });

      expect(alerts.showWarning).toHaveBeenCalledWith(
        'Respuesta vacia',
        expect.any(String),
      );
    });

    it('debería procesar el turno y actualizar el transcript', async () => {
      const { result } = renderHook(() => useLearnerExperience());
      await waitForInitialLoad(result);

      act(() => {
        result.current.setCurrentAnswer('I enjoy learning English');
      });

      await act(async () => {
        await result.current.submitTurn();
      });

      expect(result.current.state.turnIndex).toBe(1);
      expect(result.current.state.currentAnswer).toBe('');
      expect(result.current.state.transcript.length).toBeGreaterThan(0);
      expect(result.current.state.fluencyScore).toBe(80);
    });
  });

  describe('restart', () => {
    it('debería volver al step "setup" y limpiar estado de sesión', async () => {
      const { result } = renderHook(() => useLearnerExperience());
      await waitForInitialLoad(result);

      act(() => {
        result.current.restart();
      });

      expect(result.current.state.step).toBe('setup');
      expect(result.current.state.sessionId).toBe('');
      expect(result.current.state.turnIndex).toBe(0);
      expect(result.current.state.transcript).toEqual([]);
      expect(result.current.state.generatedTest).toBeNull();
    });
  });
});
