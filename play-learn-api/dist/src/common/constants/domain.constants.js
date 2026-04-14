"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATED_TEST_REASONS = exports.GENERATED_TEST_STATUSES = exports.QUESTION_TYPES = exports.SEVERITY_LEVELS = exports.FEEDBACK_TYPES = exports.SESSION_STATUSES = exports.LANGUAGE_LEVELS = void 0;
exports.LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
exports.SESSION_STATUSES = [
    'started',
    'processing',
    'completed',
    'failed',
    'cancelled',
];
exports.FEEDBACK_TYPES = [
    'grammar',
    'pronunciation',
    'fluency',
    'vocabulary',
    'semantic',
];
exports.SEVERITY_LEVELS = ['low', 'medium', 'high'];
exports.QUESTION_TYPES = [
    'multiple_choice',
    'cloze',
    'open_text',
    'reverse_translation',
];
exports.GENERATED_TEST_STATUSES = [
    'generated',
    'in_progress',
    'submitted',
    'graded',
    'cancelled',
];
exports.GENERATED_TEST_REASONS = [
    'weak_skill',
    'session_followup',
    'scheduled_practice',
    'manual_assignment',
];
//# sourceMappingURL=domain.constants.js.map