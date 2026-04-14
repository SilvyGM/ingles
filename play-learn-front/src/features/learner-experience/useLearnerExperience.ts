import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { showError, showInfo, showSuccess, showWarning } from '@/lib/alerts';
import { readSettings } from '@/lib/settings';
import type {
  GeneratedTestEntity,
  LearnerState,
  SkillProgressEntity,
  TopicEntity,
  TurnAnalysis,
  UserEntity,
} from './types';

export function useLearnerExperience() {
  const settings = useMemo(() => readSettings(), []);
  const [state, setState] = useState<LearnerState>(() => ({
    step: 'setup',
    loading: true,
    status: 'Cargando tu perfil...',
    topics: [],
    selectedTopicId: '',
    learnerName: '',
    learnerEmail: settings.email ?? '',
    emailLocked: !!settings.email,
    learnerLevel: 'A2',
    learnerUserId: '',
    sessionId: '',
    turnIndex: 0,
    currentAnswer: '',
    transcript: [],
    fluencyScore: 0,
    pronunciationScore: 0,
    grammarScore: 0,
    overallScore: 0,
    generatedTest: null,
    skillProgress: null,
  }));

  useEffect(() => {
    async function loadInitialData() {
      // Load topics and try to find existing user profile in parallel
      const email = settings.email ?? '';
      const [topicsResult, usersResult] = await Promise.allSettled([
        apiFetch<TopicEntity[]>(settings, '/topics'),
        email ? apiFetch<UserEntity[]>(settings, '/users') : Promise.resolve([] as UserEntity[]),
      ]);

      const topics =
        topicsResult.status === 'fulfilled'
          ? topicsResult.value.filter((topic) => topic.id)
          : [];

      if (topicsResult.status === 'rejected') {
        await showError('No se pudieron cargar temas', topicsResult.reason as Error);
      }

      const existingUser =
        usersResult.status === 'fulfilled' && email
          ? usersResult.value.find(
              (user) => user.email.toLowerCase() === email.toLowerCase(),
            )
          : undefined;

      setState((current) => ({
        ...current,
        loading: false,
        topics,
        selectedTopicId: topics[0]?.id ?? '',
        ...(existingUser
          ? {
              learnerName: existingUser.fullName,
              learnerEmail: existingUser.email,
              learnerLevel: existingUser.currentLevel ?? current.learnerLevel,
              learnerUserId: existingUser.id,
              status: `Bienvenido de nuevo, ${existingUser.fullName}. Elige un escenario y comienza.`,
            }
          : {
              status: 'Completa tus datos para iniciar la practica.',
            }),
      }));
    }

    void loadInitialData();
  }, [settings]);

  function setField<K extends keyof LearnerState>(key: K, value: LearnerState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function ensureUser(): Promise<string> {
    try {
      const created = await apiFetch<UserEntity>(settings, '/users', {
        method: 'POST',
        body: JSON.stringify({
          email: state.learnerEmail,
          fullName: state.learnerName,
          targetLanguage: 'en',
          currentLevel: state.learnerLevel,
        }),
      });
      return created.id;
    } catch {
      const users = await apiFetch<UserEntity[]>(settings, '/users');
      const existing = users.find(
        (user) => user.email.toLowerCase() === state.learnerEmail.toLowerCase(),
      );
      if (!existing) {
        throw new Error('No se pudo crear o recuperar usuario para esta practica.');
      }
      return existing.id;
    }
  }

  async function startPractice() {
    if (!state.learnerName.trim() || !state.learnerEmail.trim() || !state.selectedTopicId) {
      setField('status', 'Completa nombre, email y tema para iniciar.');
      await showWarning('Datos incompletos', 'Completa nombre, email y tema para iniciar.');
      return;
    }

    setField('loading', true);
    try {
      const userId = await ensureUser();
      const session = await apiFetch<{ id: string }>(settings, '/conversation-sessions', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          topicId: state.selectedTopicId,
          status: 'started',
        }),
      });

      setState((current) => ({
        ...current,
        step: 'practice',
        loading: false,
        learnerUserId: userId,
        sessionId: session.id,
        turnIndex: 0,
        transcript: [],
        currentAnswer: '',
        status: 'Sesion iniciada. Conversa libremente y finaliza cuando quieras.',
      }));
      await showSuccess('Practica iniciada', 'Comienza respondiendo el primer turno.');
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
      }));
      await showError('No se pudo iniciar practica', error);
    }
  }

  async function submitTurn() {
    const answer = state.currentAnswer.trim();
    if (!answer) {
      setField('status', 'Escribe una respuesta antes de enviar el turno.');
      await showWarning('Respuesta vacia', 'Escribe una respuesta antes de enviar el turno.');
      return;
    }

    const currentTopic = state.topics.find((topic) => topic.id === state.selectedTopicId);
    let analysis: TurnAnalysis;

    try {
      analysis = await apiFetch<TurnAnalysis>(settings, '/conversation/analyze-turn', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: state.sessionId,
          userMessage: answer,
          topicName: currentTopic?.name,
          learnerLevel: state.learnerLevel,
          turnIndex: state.turnIndex + 1,
          transcript: state.transcript,
        }),
      });
    } catch (error) {
      await showError('Error analizando turno', error);
      return;
    }

    const nextTranscript = [
      ...state.transcript,
      `Learner ${state.turnIndex + 1}: ${answer}`,
      `Coach ${state.turnIndex + 1}: ${analysis.assistantReply}`,
      `Feedback: ${analysis.detectedIssue} -> ${analysis.suggestedCorrection}`,
    ];

    const divisor = state.turnIndex + 1;
    const fluency = Math.round(
      (state.fluencyScore * state.turnIndex + analysis.fluencyScore) / divisor,
    );
    const pronunciation = Math.round(
      (state.pronunciationScore * state.turnIndex + analysis.pronunciationScore) /
        divisor,
    );
    const grammar = Math.round(
      (state.grammarScore * state.turnIndex + analysis.grammarScore) / divisor,
    );

    setState((current) => ({
      ...current,
      transcript: nextTranscript,
      currentAnswer: '',
      turnIndex: current.turnIndex + 1,
      fluencyScore: fluency,
      pronunciationScore: pronunciation,
      grammarScore: grammar,
      status: `Turno ${current.turnIndex + 1} analizado con IA. Puedes seguir conversando o finalizar cuando quieras.`,
    }));
  }

  async function finishPractice() {
    if (!state.sessionId) {
      await showWarning('Sin sesion activa', 'Primero inicia una sesion de practica.');
      return;
    }

    if (state.turnIndex === 0) {
      await showWarning('Sin turnos', 'Envia al menos un turno antes de finalizar.');
      return;
    }

    const overall = Math.round(
      (state.fluencyScore + state.pronunciationScore + state.grammarScore) / 3,
    );

    setField('loading', true);
    try {
      await apiFetch(settings, `/conversation-sessions/${state.sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed',
          endedAt: new Date().toISOString(),
          transcriptText: state.transcript.join('\n'),
          fluencyScore: state.fluencyScore,
          pronunciationScore: state.pronunciationScore,
          grammarScore: state.grammarScore,
          overallScore: overall,
        }),
      });

      const [tests, progressRows] = await Promise.all([
        apiFetch<GeneratedTestEntity[]>(settings, '/generated-tests'),
        apiFetch<SkillProgressEntity[]>(settings, '/skill-progress'),
      ]);

      const generatedTest =
        tests.find((test) => test.sourceSessionId === state.sessionId) ?? null;
      const skillProgress =
        progressRows
          .filter(
            (progress) =>
              progress.userId === state.learnerUserId &&
              progress.topicId === state.selectedTopicId,
          )
          .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] ?? null;

      setState((current) => ({
        ...current,
        step: 'summary',
        loading: false,
        currentAnswer: '',
        overallScore: overall,
        generatedTest,
        skillProgress,
        status: 'Practica finalizada. Revisa tu resumen y siguiente reto.',
      }));
      await showSuccess('Sesion finalizada', 'Tu resumen y siguiente reto estan listos.');
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
      }));
      await showError('No se pudo cerrar la sesion', error);
    }
  }

  function restart() {
    setState((current) => ({
      ...current,
      step: 'setup',
      sessionId: '',
      turnIndex: 0,
      transcript: [],
      currentAnswer: '',
      fluencyScore: 0,
      pronunciationScore: 0,
      grammarScore: 0,
      overallScore: 0,
      generatedTest: null,
      skillProgress: null,
      status: 'Puedes iniciar una nueva practica.',
    }));
    void showInfo('Nueva practica', 'Puedes iniciar una nueva sesion cuando quieras.');
  }

  return {
    state,
    setSelectedTopicId: (value: string) => setField('selectedTopicId', value),
    setLearnerName: (value: string) => setField('learnerName', value),
    setLearnerEmail: (value: string) => setField('learnerEmail', value),
    setLearnerLevel: (value: string) => setField('learnerLevel', value),
    setCurrentAnswer: (value: string) => setField('currentAnswer', value),
    startPractice,
    submitTurn,
    finishPractice,
    restart,
  };
}
