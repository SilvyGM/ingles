export const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const SESSION_STATUSES = [
  'started',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const;
export const FEEDBACK_TYPES = [
  'grammar',
  'pronunciation',
  'fluency',
  'vocabulary',
  'semantic',
] as const;
export const SEVERITY_LEVELS = ['low', 'medium', 'high'] as const;
export const QUESTION_TYPES = [
  'multiple_choice',
  'cloze',
  'open_text',
  'reverse_translation',
] as const;
export const GENERATED_TEST_STATUSES = [
  'generated',
  'in_progress',
  'submitted',
  'graded',
  'cancelled',
] as const;
export const GENERATED_TEST_REASONS = [
  'weak_skill',
  'session_followup',
  'scheduled_practice',
  'manual_assignment',
] as const;
