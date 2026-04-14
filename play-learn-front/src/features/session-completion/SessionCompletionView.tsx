import type { SessionCompletionState } from './types';

type SessionCompletionViewProps = {
  state: SessionCompletionState;
  onSelectUser: (value: string) => void;
  onSelectTopic: (value: string) => void;
  onTranscriptChange: (value: string) => void;
  onFeedbackTypeChange: (value: string) => void;
  onFeedbackSeverityChange: (value: string) => void;
  onFeedbackIssueChange: (value: string) => void;
  onFeedbackSuggestionChange: (value: string) => void;
  onOverallScoreChange: (value: string) => void;
  onFluencyScoreChange: (value: string) => void;
  onPronunciationScoreChange: (value: string) => void;
  onGrammarScoreChange: (value: string) => void;
  onCreateSession: () => void;
  onAddFeedback: () => void;
  onCompleteSession: () => void;
};

export function SessionCompletionView({
  state,
  onSelectUser,
  onSelectTopic,
  onTranscriptChange,
  onFeedbackTypeChange,
  onFeedbackSeverityChange,
  onFeedbackIssueChange,
  onFeedbackSuggestionChange,
  onOverallScoreChange,
  onFluencyScoreChange,
  onPronunciationScoreChange,
  onGrammarScoreChange,
  onCreateSession,
  onAddFeedback,
  onCompleteSession,
}: SessionCompletionViewProps) {
  return (
    <>
      <section className="card">
        <h2>Paso 1: Contexto</h2>
        <div className="grid">
          <label>
            Usuario
            <select
              value={state.selectedUserId}
              onChange={(event) => onSelectUser(event.target.value)}
            >
              <option value="">Seleccionar usuario</option>
              {state.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName ?? user.id}
                </option>
              ))}
            </select>
          </label>

          <label>
            Tema
            <select
              value={state.selectedTopicId}
              onChange={(event) => onSelectTopic(event.target.value)}
            >
              <option value="">Seleccionar tema</option>
              {state.topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name ?? topic.id}
                </option>
              ))}
            </select>
          </label>

          <label className="full">
            Transcript
            <textarea
              value={state.transcriptText}
              onChange={(event) => onTranscriptChange(event.target.value)}
            />
          </label>
        </div>
        <div className="actions">
          <button
            className="btn"
            disabled={state.busy}
            type="button"
            onClick={onCreateSession}
          >
            Crear sesion iniciada
          </button>
        </div>
        <p className="hint">Sesion activa: {state.sessionId || 'sin sesion'}</p>
      </section>

      <section className="card">
        <h2>Paso 2: Feedback</h2>
        <div className="grid">
          <label>
            Tipo
            <select
              value={state.feedbackType}
              onChange={(event) => onFeedbackTypeChange(event.target.value)}
            >
              <option value="grammar">grammar</option>
              <option value="pronunciation">pronunciation</option>
              <option value="fluency">fluency</option>
              <option value="vocabulary">vocabulary</option>
              <option value="semantic">semantic</option>
            </select>
          </label>

          <label>
            Severidad
            <select
              value={state.feedbackSeverity}
              onChange={(event) => onFeedbackSeverityChange(event.target.value)}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <label className="full">
            Problema detectado
            <textarea
              value={state.feedbackIssue}
              onChange={(event) => onFeedbackIssueChange(event.target.value)}
            />
          </label>

          <label className="full">
            Sugerencia
            <textarea
              value={state.feedbackSuggestion}
              onChange={(event) => onFeedbackSuggestionChange(event.target.value)}
            />
          </label>
        </div>
        <div className="actions">
          <button
            className="btn ghost"
            disabled={state.busy || !state.sessionId}
            type="button"
            onClick={onAddFeedback}
          >
            Agregar feedback
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Paso 3: Completar sesion y disparar regla</h2>
        <div className="grid">
          <label>
            Overall
            <input
              type="number"
              min={0}
              max={100}
              value={state.overallScore}
              onChange={(event) => onOverallScoreChange(event.target.value)}
            />
          </label>
          <label>
            Fluency
            <input
              type="number"
              min={0}
              max={100}
              value={state.fluencyScore}
              onChange={(event) => onFluencyScoreChange(event.target.value)}
            />
          </label>
          <label>
            Pronunciation
            <input
              type="number"
              min={0}
              max={100}
              value={state.pronunciationScore}
              onChange={(event) => onPronunciationScoreChange(event.target.value)}
            />
          </label>
          <label>
            Grammar
            <input
              type="number"
              min={0}
              max={100}
              value={state.grammarScore}
              onChange={(event) => onGrammarScoreChange(event.target.value)}
            />
          </label>
        </div>

        <div className="actions">
          <button
            className="btn"
            disabled={state.busy || !state.sessionId}
            type="button"
            onClick={onCompleteSession}
          >
            Completar sesion y ejecutar regla
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Resultado flujo</h2>
        <div className="result-grid">
          <article>
            <h3>Generated Test</h3>
            <pre>{JSON.stringify(state.generatedTest, null, 2)}</pre>
          </article>
          <article>
            <h3>Skill Progress</h3>
            <pre>{JSON.stringify(state.skillProgress, null, 2)}</pre>
          </article>
        </div>
      </section>
    </>
  );
}
