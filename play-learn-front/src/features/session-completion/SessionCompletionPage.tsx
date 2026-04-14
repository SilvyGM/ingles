'use client';

import { AppShell } from '@/components/AppShell';
import { SessionCompletionView } from './SessionCompletionView';
import { useSessionCompletionFlow } from './useSessionCompletionFlow';

export function SessionCompletionPage() {
  const flow = useSessionCompletionFlow();

  return (
    <AppShell
      title="Session Completion Flow"
      subtitle={flow.state.status}
    >
      <SessionCompletionView
        state={flow.state}
        onSelectUser={flow.setSelectedUserId}
        onSelectTopic={flow.setSelectedTopicId}
        onTranscriptChange={flow.setTranscriptText}
        onFeedbackTypeChange={flow.setFeedbackType}
        onFeedbackSeverityChange={flow.setFeedbackSeverity}
        onFeedbackIssueChange={flow.setFeedbackIssue}
        onFeedbackSuggestionChange={flow.setFeedbackSuggestion}
        onOverallScoreChange={flow.setOverallScore}
        onFluencyScoreChange={flow.setFluencyScore}
        onPronunciationScoreChange={flow.setPronunciationScore}
        onGrammarScoreChange={flow.setGrammarScore}
        onCreateSession={() => void flow.createStartedSession()}
        onAddFeedback={() => void flow.addFeedback()}
        onCompleteSession={() => void flow.completeSessionAndRunRule()}
      />
    </AppShell>
  );
}
