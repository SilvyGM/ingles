-- Play-Learn MVP
-- PostgreSQL schema base
-- Fecha: 2026-04-09

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    current_level VARCHAR(10) NOT NULL,
    xp_total INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_xp_total_non_negative CHECK (xp_total >= 0),
    CONSTRAINT chk_users_current_streak_non_negative CHECK (current_streak >= 0),
    CONSTRAINT chk_users_level CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
);

CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    difficulty_level VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_topics_level CHECK (difficulty_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'started',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    transcript_text TEXT,
    fluency_score NUMERIC(5,2),
    pronunciation_score NUMERIC(5,2),
    grammar_score NUMERIC(5,2),
    overall_score NUMERIC(5,2),
    audio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conversation_sessions_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_sessions_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE RESTRICT,
    CONSTRAINT chk_conversation_sessions_status
        CHECK (status IN ('started', 'processing', 'completed', 'failed', 'cancelled')),
    CONSTRAINT chk_conversation_sessions_time
        CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT chk_conversation_sessions_fluency_score
        CHECK (fluency_score IS NULL OR (fluency_score >= 0 AND fluency_score <= 100)),
    CONSTRAINT chk_conversation_sessions_pronunciation_score
        CHECK (pronunciation_score IS NULL OR (pronunciation_score >= 0 AND pronunciation_score <= 100)),
    CONSTRAINT chk_conversation_sessions_grammar_score
        CHECK (grammar_score IS NULL OR (grammar_score >= 0 AND grammar_score <= 100)),
    CONSTRAINT chk_conversation_sessions_overall_score
        CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
);

CREATE TABLE conversation_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    feedback_type VARCHAR(30) NOT NULL,
    source_fragment TEXT,
    detected_issue TEXT NOT NULL,
    suggested_correction TEXT,
    severity VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conversation_feedback_session
        FOREIGN KEY (session_id) REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    CONSTRAINT chk_conversation_feedback_type
        CHECK (feedback_type IN ('grammar', 'pronunciation', 'fluency', 'vocabulary', 'semantic')),
    CONSTRAINT chk_conversation_feedback_severity
        CHECK (severity IN ('low', 'medium', 'high'))
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    prompt_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty_level VARCHAR(10) NOT NULL,
    explanation_text TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_questions_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE RESTRICT,
    CONSTRAINT fk_questions_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT chk_questions_type
        CHECK (question_type IN ('multiple_choice', 'cloze', 'open_text', 'reverse_translation')),
    CONSTRAINT chk_questions_level
        CHECK (difficulty_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
);

CREATE TABLE generated_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    topic_id UUID,
    source_session_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'generated',
    total_questions INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(5,2),
    generated_reason VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    CONSTRAINT fk_generated_tests_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_generated_tests_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    CONSTRAINT fk_generated_tests_source_session
        FOREIGN KEY (source_session_id) REFERENCES conversation_sessions(id) ON DELETE SET NULL,
    CONSTRAINT chk_generated_tests_status
        CHECK (status IN ('generated', 'in_progress', 'submitted', 'graded', 'cancelled')),
    CONSTRAINT chk_generated_tests_total_questions_non_negative
        CHECK (total_questions >= 0),
    CONSTRAINT chk_generated_tests_score
        CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    CONSTRAINT chk_generated_tests_reason
        CHECK (generated_reason IN ('weak_skill', 'session_followup', 'scheduled_practice', 'manual_assignment')),
    CONSTRAINT chk_generated_tests_submitted_at
        CHECK (submitted_at IS NULL OR submitted_at >= created_at)
);

CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_test_id UUID NOT NULL,
    question_id UUID NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    feedback_text TEXT,
    answered_at TIMESTAMPTZ,
    CONSTRAINT fk_test_answers_generated_test
        FOREIGN KEY (generated_test_id) REFERENCES generated_tests(id) ON DELETE CASCADE,
    CONSTRAINT fk_test_answers_question
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT,
    CONSTRAINT uq_test_answers_test_question UNIQUE (generated_test_id, question_id)
);

CREATE TABLE skill_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    topic_id UUID,
    mastery_level NUMERIC(5,2) NOT NULL DEFAULT 0,
    last_score NUMERIC(5,2),
    last_practiced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_skill_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_skill_progress_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
    CONSTRAINT fk_skill_progress_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    CONSTRAINT chk_skill_progress_mastery_level
        CHECK (mastery_level >= 0 AND mastery_level <= 100),
    CONSTRAINT chk_skill_progress_last_score
        CHECK (last_score IS NULL OR (last_score >= 0 AND last_score <= 100))
);

CREATE UNIQUE INDEX uq_skill_progress_with_topic
    ON skill_progress (user_id, skill_id, topic_id)
    WHERE topic_id IS NOT NULL;

CREATE UNIQUE INDEX uq_skill_progress_without_topic
    ON skill_progress (user_id, skill_id)
    WHERE topic_id IS NULL;

CREATE INDEX idx_conversation_sessions_user_id
    ON conversation_sessions (user_id);

CREATE INDEX idx_conversation_sessions_topic_id
    ON conversation_sessions (topic_id);

CREATE INDEX idx_conversation_sessions_status
    ON conversation_sessions (status);

CREATE INDEX idx_conversation_feedback_session_id
    ON conversation_feedback (session_id);

CREATE INDEX idx_questions_topic_skill
    ON questions (topic_id, skill_id);

CREATE INDEX idx_generated_tests_user_id
    ON generated_tests (user_id);

CREATE INDEX idx_generated_tests_source_session_id
    ON generated_tests (source_session_id);

CREATE INDEX idx_test_answers_generated_test_id
    ON test_answers (generated_test_id);

CREATE INDEX idx_skill_progress_user_id
    ON skill_progress (user_id);

CREATE INDEX idx_skill_progress_skill_id
    ON skill_progress (skill_id);

CREATE INDEX idx_skill_progress_topic_id
    ON skill_progress (topic_id);

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_skill_progress_set_updated_at
BEFORE UPDATE ON skill_progress
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;