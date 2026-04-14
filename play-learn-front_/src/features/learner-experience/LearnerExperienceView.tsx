import type { LearnerState } from './types';

type LearnerExperienceViewProps = {
  state: LearnerState;
  onTopicChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onStart: () => void;
  onSubmitTurn: () => void;
  onFinishPractice: () => void;
  onRestart: () => void;
  onLogout: () => void;
};

const STEP_KEYS = ['setup', 'practice', 'summary'];
const STEP_LABELS = ['Configurar', 'Practicar', 'Resultados'];

function scoreClass(n: number): string {
  if (n >= 75) return 'good';
  if (n >= 55) return 'mid';
  return 'low';
}

export function LearnerExperienceView({
  state,
  onTopicChange,
  onNameChange,
  onEmailChange,
  onLevelChange,
  onAnswerChange,
  onStart,
  onSubmitTurn,
  onFinishPractice,
  onRestart,
  onLogout,
}: LearnerExperienceViewProps) {
  const selectedTopic = state.topics.find((topic) => topic.id === state.selectedTopicId);
  const latestCoachLine = [...state.transcript]
    .reverse()
    .find((line) => line.startsWith('Coach'));
  const currentPrompt = latestCoachLine
    ? latestCoachLine.split(':').slice(1).join(':').trim()
    : `Welcome to the ${selectedTopic?.name ?? 'conversation'} scenario. Introduce yourself and start naturally in English.`;
  const mastery = Number(state.skillProgress?.masteryLevel ?? 0);
  const followUpQuestions = state.generatedTest?.totalQuestions ?? 0;
  const currentStepIndex = STEP_KEYS.indexOf(state.step);
  const reversedTranscript = [...state.transcript].reverse();

  const focusMessage =
    mastery >= 75
      ? 'Buen avance. Enfoca la siguiente sesion en fluidez y expresiones naturales.'
      : mastery >= 55
        ? 'Vas progresando. Refuerza precision gramatical y vocabulario contextual.'
        : 'Conviene reforzar estructura base y practicar respuestas mas completas.';

  const levelTag =
    state.overallScore >= 80
      ? 'B2 objetivo alcanzable'
      : state.overallScore >= 65
        ? 'B1 en consolidacion'
        : 'A2 con margen de mejora';

  return (
    <main className="learner-shell">

      {/* ── Top nav ── */}
      <header className="learner-nav">
        <div className="learner-brand">
          <span className="sidebar-kicker">Play-Learn</span>
          <span className="learner-brand-sub">Practica Conversacional</span>
        </div>
        <button className="btn ghost sm" onClick={onLogout} type="button">
          Cerrar sesion
        </button>
      </header>

      {/* ── Step progress ── */}
      <div className="learner-steps">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="learner-step-group">
            <div
              className={`step-item ${i === currentStepIndex ? 'active' : i < currentStepIndex ? 'done' : ''}`}
            >
              <div className="step-dot">{i < currentStepIndex ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`step-line ${i < currentStepIndex ? 'done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Global status hint ── */}
      {state.status && <p className="learner-status">{state.status}</p>}

      {/* ══════════════════════════ SETUP ══════════════════════════ */}
      {state.step === 'setup' && (
        <section className="card">
          <h2>Configura tu sesion</h2>
          <p className="hint">
            {state.learnerName
              ? `Hola, ${state.learnerName}. Elige un escenario y comienza.`
              : 'Completa tu perfil y elige un escenario para comenzar.'}
          </p>

          <div className="grid">
            <label>
              Nombre
              <input
                value={state.learnerName}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Tu nombre"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={state.learnerEmail}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="tu@email.com"
                readOnly={state.emailLocked}
                className={state.emailLocked ? 'prefilled' : ''}
              />
            </label>

            <label>
              Nivel actual
              <select
                value={state.learnerLevel}
                onChange={(event) => onLevelChange(event.target.value)}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </label>

            <label>
              Escenario de practica
              <select
                value={state.selectedTopicId}
                onChange={(event) => onTopicChange(event.target.value)}
              >
                <option value="">— Seleccionar tema —</option>
                {state.topics.map((topic) => (
                  <option value={topic.id} key={topic.id}>
                    {topic.name} ({topic.difficultyLevel})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="actions setup-actions">
            <button
              className="btn start-btn"
              type="button"
              disabled={state.loading}
              onClick={onStart}
            >
              {state.loading ? 'Cargando...' : 'Empezar practica →'}
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════════ PRACTICE ══════════════════════════ */}
      {state.step === 'practice' && (
        <section className="card practice-card">
          <div className="turn-header">
            <h2>
              Turno {state.turnIndex + 1}
              <span className="turn-of"> (conversacion abierta)</span>
            </h2>
          </div>

          <div className="practice-layout">
            <section className="turn-log chat-panel">
              <div className="chat-header-row">
                <h3>Historial de conversacion</h3>
                <span className="hint history-hint">Mas reciente arriba</span>
              </div>

              <div className="chat-scroll" role="log" aria-live="polite">
                {reversedTranscript.length === 0 && (
                  <p className="hint">Aun no hay mensajes. Escribe tu primer turno.</p>
                )}

                {reversedTranscript.length > 0 && (
                  <ul className="chat-log">
                    {reversedTranscript.map((line, index) => {
                      const roleClass = line.startsWith('Learner')
                        ? 'user-line'
                        : line.startsWith('Coach')
                          ? 'coach-line'
                          : 'feedback-line';

                      return (
                        <li key={`${line}-${index}`} className={roleClass}>
                          {line}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>

            <aside className="composer-panel">
              <div className="coach-message">
                <div className="coach-avatar">🎯</div>
                <div className="coach-bubble">{currentPrompt}</div>
              </div>

              <label className="full answer-label">
                Tu respuesta en ingles
                <textarea
                  value={state.currentAnswer}
                  onChange={(event) => onAnswerChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      if (!state.loading) {
                        onSubmitTurn();
                      }
                    }
                  }}
                  placeholder="Write your answer here in English..."
                  rows={8}
                />
              </label>

              <p className="hint keyboard-hint">Enter envia. Shift + Enter agrega salto de linea.</p>

              <div className="actions compose-actions">
                <button
                  className="btn"
                  type="button"
                  disabled={state.loading}
                  onClick={onSubmitTurn}
                >
                  {state.loading ? 'Procesando...' : 'Enviar turno →'}
                </button>
              </div>

              <div className="finish-zone">
                <p className="hint">Cuando quieras cerrar, termina la sesion desde aqui.</p>
                <button
                  className="btn danger"
                  type="button"
                  disabled={state.loading || state.turnIndex === 0}
                  onClick={onFinishPractice}
                >
                  Finalizar sesion
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ══════════════════════════ SUMMARY ══════════════════════════ */}
      {state.step === 'summary' && (
        <>
          <section className="card">
            <h2>Resultados de tu sesion</h2>

            <div className="score-cards">
              <div className={`score-card ${scoreClass(state.fluencyScore)}`}>
                <strong className="score-value">{state.fluencyScore}</strong>
                <span className="score-label">Fluency</span>
              </div>
              <div className={`score-card ${scoreClass(state.pronunciationScore)}`}>
                <strong className="score-value">{state.pronunciationScore}</strong>
                <span className="score-label">Pronunciation</span>
              </div>
              <div className={`score-card ${scoreClass(state.grammarScore)}`}>
                <strong className="score-value">{state.grammarScore}</strong>
                <span className="score-label">Grammar</span>
              </div>
            </div>

            <div className="overall-row">
              <span className={`overall-value ${scoreClass(state.overallScore)}`}>
                {state.overallScore}
              </span>
              <div>
                <p className="overall-label">Puntaje general</p>
                <span className={`level-badge ${scoreClass(state.overallScore)}`}>{levelTag}</span>
              </div>
            </div>

            <div className="recommendation-card">
              <p className="rec-title">Recomendacion</p>
              <p>{focusMessage}</p>
            </div>
          </section>

          <section className="card">
            <h2>Progreso y siguiente reto</h2>
            <div className="result-grid learner-report-grid">
              <article>
                <h3>Test de seguimiento</h3>
                <p className="hint">El sistema genero un test basado en tu sesion.</p>
                <div className="report-metric">
                  <span>Reactivos</span>
                  <strong>{followUpQuestions || 'Pendiente'}</strong>
                </div>
                {followUpQuestions === 0 && (
                  <p className="hint">
                    Aun no hay reactivos asignados en esta sesion. Este bloque depende del
                    modulo de questions/test-answers para el flujo adaptativo completo.
                  </p>
                )}
                <div className="report-metric">
                  <span>Motivo</span>
                  <strong>{state.generatedTest?.generatedReason ?? 'session_followup'}</strong>
                </div>
                <div className="report-metric">
                  <span>Estado</span>
                  <strong>{state.generatedTest?.status ?? 'generated'}</strong>
                </div>
              </article>
              <article>
                <h3>Habilidad dominada</h3>
                <p className="hint">Tu mastery actualizado despues de la practica.</p>
                <div className="mastery-bar">
                  <span style={{ width: `${Math.max(0, Math.min(mastery, 100))}%` }} />
                </div>
                <div className="report-metric">
                  <span>Mastery</span>
                  <strong>{mastery || 'Pendiente'}</strong>
                </div>
                <div className="report-metric">
                  <span>Ultimo score</span>
                  <strong>{state.skillProgress?.lastScore ?? state.overallScore}</strong>
                </div>
              </article>
            </div>

            <div className="actions summary-actions">
              <button className="btn" type="button" onClick={onRestart}>
                Practicar otro escenario →
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
