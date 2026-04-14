import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { showError, showSuccess, showWarning } from '@/lib/alerts';
import { readSettings } from '@/lib/settings';
import type {
  BasicEntity,
  GeneratedTestEntity,
  SessionCompletionState,
  SessionEntity,
  SkillProgressEntity,
} from './types';

export function useSessionCompletionFlow() {
  const settings = useMemo(() => readSettings(), []);

  const [state, setState] = useState<SessionCompletionState>({
    users: [],
    topics: [],
    selectedUserId: '',
    selectedTopicId: '',
    sessionId: '',
    overallScore: '62',
    fluencyScore: '60',
    pronunciationScore: '58',
    grammarScore: '65',
    transcriptText: 'Short roleplay transcript for Sprint 1 validation.',
    feedbackType: 'grammar',
    feedbackSeverity: 'high',
    feedbackIssue: 'Incorrect tense selection in past simple answers.',
    feedbackSuggestion:
      'Use simple past verbs consistently for completed actions.',
    generatedTest: null,
    skillProgress: null,
    status: 'Listo para ejecutar flujo de sesion completada.',
    busy: false,
  });

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [apiUsers, apiTopics] = await Promise.all([
          apiFetch<BasicEntity[]>(settings, '/users'),
          apiFetch<BasicEntity[]>(settings, '/topics'),
        ]);

        setState((current) => ({
          ...current,
          users: apiUsers,
          topics: apiTopics,
          selectedUserId: apiUsers[0]?.id ?? current.selectedUserId,
          selectedTopicId: apiTopics[0]?.id ?? current.selectedTopicId,
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          status: `No se pudo cargar catalogos: ${String(error)}`,
        }));
        await showError('Error cargando catalogos', error);
      }
    }

    void loadCatalogs();
  }, [settings]);

  async function createStartedSession() {
    if (!state.selectedUserId || !state.selectedTopicId) {
      setState((current) => ({
        ...current,
        status: 'Selecciona usuario y tema antes de crear sesion.',
      }));
      await showWarning('Campos requeridos', 'Selecciona usuario y tema antes de continuar.');
      return;
    }

    setState((current) => ({ ...current, busy: true }));
    try {
      const session = await apiFetch<SessionEntity>(
        settings,
        '/conversation-sessions',
        {
          method: 'POST',
          body: JSON.stringify({
            userId: state.selectedUserId,
            topicId: state.selectedTopicId,
            status: 'started',
            transcriptText: state.transcriptText,
          }),
        },
      );

      setState((current) => ({
        ...current,
        sessionId: session.id,
        generatedTest: null,
        skillProgress: null,
        status: `Sesion iniciada: ${session.id}`,
        busy: false,
      }));
      await showSuccess('Sesion iniciada', 'Ya puedes agregar feedback al escenario.');
    } catch (error) {
      setState((current) => ({
        ...current,
        status: `Error creando sesion: ${String(error)}`,
        busy: false,
      }));
      await showError('No se pudo crear sesion', error);
    }
  }

  async function addFeedback() {
    if (!state.sessionId) {
      setState((current) => ({
        ...current,
        status: 'Primero crea una sesion iniciada.',
      }));
      await showWarning('Sesion requerida', 'Primero crea una sesion iniciada.');
      return;
    }

    setState((current) => ({ ...current, busy: true }));
    try {
      await apiFetch(settings, '/conversation-feedback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: state.sessionId,
          feedbackType: state.feedbackType,
          severity: state.feedbackSeverity,
          detectedIssue: state.feedbackIssue,
          suggestedCorrection: state.feedbackSuggestion,
        }),
      });

      setState((current) => ({
        ...current,
        status: 'Feedback agregado a la sesion.',
        busy: false,
      }));
      await showSuccess('Feedback agregado', 'El feedback quedo asociado a la sesion.');
    } catch (error) {
      setState((current) => ({
        ...current,
        status: `Error agregando feedback: ${String(error)}`,
        busy: false,
      }));
      await showError('No se pudo agregar feedback', error);
    }
  }

  async function completeSessionAndRunRule() {
    if (!state.sessionId) {
      setState((current) => ({
        ...current,
        status: 'No hay sesion activa para completar.',
      }));
      await showWarning('Sesion requerida', 'No hay sesion activa para completar.');
      return;
    }

    setState((current) => ({ ...current, busy: true }));
    try {
      await apiFetch(settings, `/conversation-sessions/${state.sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed',
          endedAt: new Date().toISOString(),
          transcriptText: state.transcriptText,
          overallScore: Number(state.overallScore),
          fluencyScore: Number(state.fluencyScore),
          pronunciationScore: Number(state.pronunciationScore),
          grammarScore: Number(state.grammarScore),
        }),
      });

      const [tests, progressRows] = await Promise.all([
        apiFetch<GeneratedTestEntity[]>(settings, '/generated-tests'),
        apiFetch<SkillProgressEntity[]>(settings, '/skill-progress'),
      ]);

      const testForSession =
        tests.find((item) => item.sourceSessionId === state.sessionId) ?? null;
      const progressForUserTopic =
        progressRows
          .filter(
            (item) =>
              item.userId === state.selectedUserId &&
              item.topicId === state.selectedTopicId,
          )
          .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] ??
        null;

      setState((current) => ({
        ...current,
        generatedTest: testForSession,
        skillProgress: progressForUserTopic,
        status:
          'Sesion completada. Regla central ejecutada y resultados consultados.',
        busy: false,
      }));
      await showSuccess('Regla ejecutada', 'Progreso y test de seguimiento actualizados.');
    } catch (error) {
      setState((current) => ({
        ...current,
        status: `Error completando sesion: ${String(error)}`,
        busy: false,
      }));
      await showError('No se pudo completar sesion', error);
    }
  }

  return {
    state,
    setSelectedUserId: (value: string) =>
      setState((current) => ({ ...current, selectedUserId: value })),
    setSelectedTopicId: (value: string) =>
      setState((current) => ({ ...current, selectedTopicId: value })),
    setTranscriptText: (value: string) =>
      setState((current) => ({ ...current, transcriptText: value })),
    setFeedbackType: (value: string) =>
      setState((current) => ({ ...current, feedbackType: value })),
    setFeedbackSeverity: (value: string) =>
      setState((current) => ({ ...current, feedbackSeverity: value })),
    setFeedbackIssue: (value: string) =>
      setState((current) => ({ ...current, feedbackIssue: value })),
    setFeedbackSuggestion: (value: string) =>
      setState((current) => ({ ...current, feedbackSuggestion: value })),
    setOverallScore: (value: string) =>
      setState((current) => ({ ...current, overallScore: value })),
    setFluencyScore: (value: string) =>
      setState((current) => ({ ...current, fluencyScore: value })),
    setPronunciationScore: (value: string) =>
      setState((current) => ({ ...current, pronunciationScore: value })),
    setGrammarScore: (value: string) =>
      setState((current) => ({ ...current, grammarScore: value })),
    createStartedSession,
    addFeedback,
    completeSessionAndRunRule,
  };
}
