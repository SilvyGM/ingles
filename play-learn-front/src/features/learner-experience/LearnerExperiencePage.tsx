'use client';

import { useRouter } from 'next/navigation';
import { confirmDanger } from '@/lib/alerts';
import { clearSessionCookie } from '@/lib/auth';
import { clearSettings } from '@/lib/settings';
import { LearnerExperienceView } from './LearnerExperienceView';
import { useLearnerExperience } from './useLearnerExperience';

export function LearnerExperiencePage() {
  const flow = useLearnerExperience();
  const router = useRouter();

  async function handleFinishPractice() {
    const confirmed = await confirmDanger(
      'Finalizar sesion',
      'Se cerrara la sesion actual y se calculara tu resumen final.',
    );

    if (!confirmed) {
      return;
    }

    await flow.finishPractice();
  }

  async function handleLogout() {
    const confirmed = await confirmDanger(
      'Cerrar sesion',
      'Se cerrara tu sesion actual de aprendizaje.',
    );

    if (!confirmed) {
      return;
    }

    clearSessionCookie();
    clearSettings();
    router.push('/login');
  }

  return (
    <LearnerExperienceView
      state={flow.state}
      onTopicChange={flow.setSelectedTopicId}
      onNameChange={flow.setLearnerName}
      onEmailChange={flow.setLearnerEmail}
      onLevelChange={flow.setLearnerLevel}
      onAnswerChange={flow.setCurrentAnswer}
      onStart={() => void flow.startPractice()}
      onSubmitTurn={() => void flow.submitTurn()}
      onFinishPractice={() => void handleFinishPractice()}
      onRestart={flow.restart}
      onLogout={() => void handleLogout()}
    />
  );
}
