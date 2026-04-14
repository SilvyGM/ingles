-- Play-Learn MVP
-- Seed inicial para PostgreSQL
-- Requiere haber ejecutado antes: play_learn_mvp_postgres.sql
-- Fecha: 2026-04-09

BEGIN;

-- Topics base
INSERT INTO topics (name, slug, category, difficulty_level, is_active)
VALUES
    ('En el aeropuerto', 'en-el-aeropuerto', 'travel', 'A2', TRUE),
    ('En el restaurante', 'en-el-restaurante', 'daily-life', 'A1', TRUE),
    ('Entrevista de trabajo', 'entrevista-de-trabajo', 'career', 'B1', TRUE),
    ('En el medico', 'en-el-medico', 'health', 'A2', TRUE),
    ('Presentaciones personales', 'presentaciones-personales', 'social', 'A1', TRUE),
    ('Reuniones de trabajo', 'reuniones-de-trabajo', 'career', 'B2', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Skills base
INSERT INTO skills (code, name, category, description, is_active)
VALUES
    ('grammar_tobe', 'Verbo To Be', 'grammar', 'Uso correcto del verbo to be en afirmacion, negacion y pregunta.', TRUE),
    ('grammar_past_simple', 'Pasado Simple', 'grammar', 'Construccion de oraciones en pasado simple.', TRUE),
    ('pronunciation_th', 'Pronunciacion TH', 'pronunciation', 'Produccion del fonema th en palabras frecuentes.', TRUE),
    ('fluency_basic', 'Fluidez Basica', 'fluency', 'Capacidad de responder con continuidad y pocas pausas.', TRUE),
    ('vocabulary_travel', 'Vocabulario de Viaje', 'vocabulary', 'Vocabulario comun para transporte, reservas y aeropuerto.', TRUE),
    ('vocabulary_job_interview', 'Vocabulario de Entrevista', 'vocabulary', 'Vocabulario comun para experiencia, habilidades y objetivos.', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Usuario demo
INSERT INTO users (email, full_name, target_language, current_level, xp_total, current_streak)
VALUES
    ('demo@playlearn.app', 'Demo Student', 'en', 'A2', 120, 3)
ON CONFLICT (email) DO NOTHING;

-- Progreso inicial del usuario demo
INSERT INTO skill_progress (user_id, skill_id, topic_id, mastery_level, last_score, last_practiced_at)
SELECT
    u.id,
    s.id,
    t.id,
    seed.mastery_level,
    seed.last_score,
    NOW() - seed.days_ago * INTERVAL '1 day'
FROM users u
JOIN (
    VALUES
        ('grammar_tobe', 'presentaciones-personales', 72.00::numeric, 75.00::numeric, 2),
        ('fluency_basic', 'presentaciones-personales', 58.00::numeric, 60.00::numeric, 2),
        ('pronunciation_th', 'en-el-restaurante', 35.00::numeric, 40.00::numeric, 5),
        ('vocabulary_travel', 'en-el-aeropuerto', 48.00::numeric, 50.00::numeric, 4),
        ('grammar_past_simple', 'entrevista-de-trabajo', 30.00::numeric, 32.00::numeric, 6),
        ('vocabulary_job_interview', 'entrevista-de-trabajo', 45.00::numeric, 47.00::numeric, 6)
) AS seed(skill_code, topic_slug, mastery_level, last_score, days_ago)
    ON TRUE
JOIN skills s ON s.code = seed.skill_code
JOIN topics t ON t.slug = seed.topic_slug
WHERE u.email = 'demo@playlearn.app'
ON CONFLICT DO NOTHING;

-- Banco inicial de preguntas
INSERT INTO questions (topic_id, skill_id, question_type, prompt_text, correct_answer, difficulty_level, explanation_text, is_active)
SELECT t.id, s.id, q.question_type, q.prompt_text, q.correct_answer, q.difficulty_level, q.explanation_text, TRUE
FROM (
    VALUES
        ('presentaciones-personales', 'grammar_tobe', 'multiple_choice', 'Complete: I ___ from Colombia.', 'am', 'A1', 'Con el sujeto I se usa am.'),
        ('presentaciones-personales', 'grammar_tobe', 'cloze', 'Complete la frase: She ___ a student.', 'is', 'A1', 'Con she se usa is.'),
        ('en-el-aeropuerto', 'vocabulary_travel', 'multiple_choice', 'What do you show before boarding the plane?', 'boarding pass', 'A2', 'Boarding pass es el documento para abordar.'),
        ('en-el-aeropuerto', 'vocabulary_travel', 'reverse_translation', 'Traduce al ingles: Necesito encontrar mi puerta de embarque.', 'I need to find my boarding gate.', 'A2', 'Gate se usa para puerta de embarque.'),
        ('en-el-restaurante', 'pronunciation_th', 'open_text', 'Write a short sentence using the word thanks.', 'Thanks for the food.', 'A1', 'Se busca practicar palabras frecuentes con th.'),
        ('entrevista-de-trabajo', 'grammar_past_simple', 'cloze', 'Complete: Last year, I ___ in customer service.', 'worked', 'B1', 'Para pasado simple regular se usa worked.'),
        ('entrevista-de-trabajo', 'vocabulary_job_interview', 'multiple_choice', 'Which word best completes the sentence: My main ___ is problem solving.', 'strength', 'B1', 'Strength significa fortaleza profesional.'),
        ('entrevista-de-trabajo', 'vocabulary_job_interview', 'reverse_translation', 'Traduce al ingles: Tengo experiencia trabajando en equipo.', 'I have experience working in a team.', 'B1', 'Expresion comun en entrevistas.'),
        ('reuniones-de-trabajo', 'fluency_basic', 'open_text', 'Write one sentence to politely interrupt in a meeting.', 'Sorry to interrupt, but I would like to add something.', 'B2', 'Busca practicar formula de interrupcion educada.'),
        ('en-el-medico', 'grammar_tobe', 'multiple_choice', 'Complete: My arm ___ sore.', 'is', 'A2', 'Arm es singular, por eso se usa is.')
) AS q(topic_slug, skill_code, question_type, prompt_text, correct_answer, difficulty_level, explanation_text)
JOIN topics t ON t.slug = q.topic_slug
JOIN skills s ON s.code = q.skill_code
WHERE NOT EXISTS (
    SELECT 1
    FROM questions existing
    WHERE existing.prompt_text = q.prompt_text
);

-- Sesion demo de conversacion
WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@playlearn.app'
), demo_topic AS (
    SELECT id FROM topics WHERE slug = 'entrevista-de-trabajo'
)
INSERT INTO conversation_sessions (
    user_id,
    topic_id,
    status,
    started_at,
    ended_at,
    transcript_text,
    fluency_score,
    pronunciation_score,
    grammar_score,
    overall_score,
    audio_url
)
SELECT
    u.id,
    t.id,
    'completed',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '8 minutes',
    'Hello, my name is Ana. I worked in sales for two years. I want this job because I like working with people, but sometimes I have difficulty explaining my experience in past tense.',
    64.00,
    61.00,
    46.00,
    57.00,
    'https://storage.playlearn.local/audio/demo-interview-session-001.webm'
FROM demo_user u
CROSS JOIN demo_topic t
WHERE NOT EXISTS (
    SELECT 1
    FROM conversation_sessions cs
    WHERE cs.user_id = u.id
      AND cs.topic_id = t.id
      AND cs.audio_url = 'https://storage.playlearn.local/audio/demo-interview-session-001.webm'
);

-- Feedback demo de la sesion
INSERT INTO conversation_feedback (session_id, feedback_type, source_fragment, detected_issue, suggested_correction, severity)
SELECT cs.id, data.feedback_type, data.source_fragment, data.detected_issue, data.suggested_correction, data.severity
FROM conversation_sessions cs
JOIN users u ON u.id = cs.user_id
JOIN topics t ON t.id = cs.topic_id
JOIN (
    VALUES
        ('grammar', 'I worked in sales for two years.', 'Buen uso del pasado simple, pero falta ampliar detalles con conectores.', 'Try: I worked in sales for two years, where I helped customers and handled daily reports.', 'medium'),
        ('fluency', 'I want this job because I like working with people', 'La idea es correcta, pero puede sonar mas natural con una razon mas especifica.', 'Try adding a clearer motivation connected to the role.', 'low'),
        ('pronunciation', 'three / think / thank', 'Posible dificultad recurrente con el fonema th.', 'Practice minimal pairs with th and record short repetitions.', 'high')
) AS data(feedback_type, source_fragment, detected_issue, suggested_correction, severity)
    ON TRUE
WHERE u.email = 'demo@playlearn.app'
  AND t.slug = 'entrevista-de-trabajo'
  AND cs.audio_url = 'https://storage.playlearn.local/audio/demo-interview-session-001.webm'
  AND NOT EXISTS (
      SELECT 1
      FROM conversation_feedback cf
      WHERE cf.session_id = cs.id
        AND cf.detected_issue = data.detected_issue
  );

-- Test generado de seguimiento
WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@playlearn.app'
), demo_topic AS (
    SELECT id FROM topics WHERE slug = 'entrevista-de-trabajo'
), demo_session AS (
    SELECT cs.id
    FROM conversation_sessions cs
    JOIN users u ON u.id = cs.user_id
    JOIN topics t ON t.id = cs.topic_id
    WHERE u.email = 'demo@playlearn.app'
      AND t.slug = 'entrevista-de-trabajo'
      AND cs.audio_url = 'https://storage.playlearn.local/audio/demo-interview-session-001.webm'
    LIMIT 1
)
INSERT INTO generated_tests (
    user_id,
    topic_id,
    source_session_id,
    status,
    total_questions,
    score,
    generated_reason,
    created_at,
    submitted_at
)
SELECT
    u.id,
    t.id,
    s.id,
    'graded',
    2,
    50.00,
    'session_followup',
    NOW() - INTERVAL '23 hours',
    NOW() - INTERVAL '22 hours 50 minutes'
FROM demo_user u
CROSS JOIN demo_topic t
CROSS JOIN demo_session s
WHERE NOT EXISTS (
    SELECT 1
    FROM generated_tests gt
    WHERE gt.source_session_id = s.id
      AND gt.generated_reason = 'session_followup'
);

-- Respuestas demo del test
INSERT INTO test_answers (generated_test_id, question_id, user_answer, is_correct, feedback_text, answered_at)
SELECT gt.id, q.id, qa.user_answer, qa.is_correct, qa.feedback_text, NOW() - INTERVAL '22 hours 45 minutes'
FROM generated_tests gt
JOIN users u ON u.id = gt.user_id
JOIN (
    VALUES
        ('Complete: Last year, I ___ in customer service.', 'work', FALSE, 'Debio ser worked para pasado simple.'),
        ('Which word best completes the sentence: My main ___ is problem solving.', 'strength', TRUE, 'Respuesta correcta.')
) AS qa(prompt_text, user_answer, is_correct, feedback_text)
    ON TRUE
JOIN questions q ON q.prompt_text = qa.prompt_text
WHERE u.email = 'demo@playlearn.app'
  AND gt.generated_reason = 'session_followup'
  AND NOT EXISTS (
      SELECT 1
      FROM test_answers ta
      WHERE ta.generated_test_id = gt.id
        AND ta.question_id = q.id
  );

COMMIT;