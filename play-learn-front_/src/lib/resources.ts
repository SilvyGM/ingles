export type ResourceKey =
  | 'users'
  | 'topics'
  | 'skills'
  | 'questions'
  | 'conversation-sessions'
  | 'conversation-feedback'
  | 'generated-tests'
  | 'test-answers'
  | 'skill-progress';

export type ResourceConfig = {
  key: ResourceKey;
  label: string;
  description: string;
  writableFields: string[];
  defaultPayload: Record<string, unknown>;
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SESSION_STATUSES = ['started', 'processing', 'completed', 'failed', 'cancelled'];
const FEEDBACK_TYPES = ['grammar', 'pronunciation', 'fluency', 'vocabulary', 'semantic'];
const SEVERITY = ['low', 'medium', 'high'];
const QUESTION_TYPES = ['multiple_choice', 'cloze', 'open_text', 'reverse_translation'];
const GENERATED_STATUSES = ['generated', 'in_progress', 'submitted', 'graded', 'cancelled'];
const GENERATED_REASONS = ['weak_skill', 'session_followup', 'scheduled_practice', 'manual_assignment'];

export const RESOURCE_CONFIGS: ResourceConfig[] = [
  {
    key: 'users',
    label: 'Usuarios',
    description: 'Gestion de usuarios y nivel actual.',
    writableFields: ['email', 'fullName', 'targetLanguage', 'currentLevel', 'xpTotal', 'currentStreak'],
    defaultPayload: {
      email: 'demo@playlearn.app',
      fullName: 'Demo Student',
      targetLanguage: 'en',
      currentLevel: LEVELS[1],
      xpTotal: 0,
      currentStreak: 0,
    },
  },
  {
    key: 'topics',
    label: 'Temas',
    description: 'Escenarios de conversacion.',
    writableFields: ['name', 'slug', 'category', 'difficultyLevel', 'isActive'],
    defaultPayload: {
      name: 'En el aeropuerto',
      slug: 'en-el-aeropuerto',
      category: 'travel',
      difficultyLevel: LEVELS[1],
      isActive: true,
    },
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Habilidades de aprendizaje.',
    writableFields: ['code', 'name', 'category', 'description', 'isActive'],
    defaultPayload: {
      code: 'grammar_past_simple',
      name: 'Pasado Simple',
      category: 'grammar',
      description: 'Construccion de pasado simple.',
      isActive: true,
    },
  },
  {
    key: 'questions',
    label: 'Preguntas',
    description: 'Banco de preguntas adaptativas.',
    writableFields: [
      'topicId',
      'skillId',
      'questionType',
      'promptText',
      'correctAnswer',
      'difficultyLevel',
      'explanationText',
      'isActive',
    ],
    defaultPayload: {
      topicId: 'UUID_TOPIC',
      skillId: 'UUID_SKILL',
      questionType: QUESTION_TYPES[0],
      promptText: 'I ____ to school yesterday.',
      correctAnswer: 'went',
      difficultyLevel: LEVELS[2],
      explanationText: 'Use past simple of go: went.',
      isActive: true,
    },
  },
  {
    key: 'conversation-sessions',
    label: 'Sesiones',
    description: 'Sesiones de conversacion por usuario.',
    writableFields: [
      'userId',
      'topicId',
      'status',
      'startedAt',
      'endedAt',
      'transcriptText',
      'fluencyScore',
      'pronunciationScore',
      'grammarScore',
      'overallScore',
      'audioUrl',
    ],
    defaultPayload: {
      userId: 'UUID_USER',
      topicId: 'UUID_TOPIC',
      status: SESSION_STATUSES[0],
      transcriptText: '',
      fluencyScore: 0,
      pronunciationScore: 0,
      grammarScore: 0,
      overallScore: 0,
      audioUrl: '',
    },
  },
  {
    key: 'conversation-feedback',
    label: 'Feedback',
    description: 'Feedback detectado en sesiones.',
    writableFields: [
      'sessionId',
      'feedbackType',
      'sourceFragment',
      'detectedIssue',
      'suggestedCorrection',
      'severity',
    ],
    defaultPayload: {
      sessionId: 'UUID_SESSION',
      feedbackType: FEEDBACK_TYPES[0],
      sourceFragment: 'I go yesterday',
      detectedIssue: 'Uso incorrecto del tiempo verbal.',
      suggestedCorrection: 'I went yesterday',
      severity: SEVERITY[1],
    },
  },
  {
    key: 'generated-tests',
    label: 'Tests Generados',
    description: 'Instancias de evaluaciones dinamicas.',
    writableFields: [
      'userId',
      'topicId',
      'sourceSessionId',
      'status',
      'totalQuestions',
      'score',
      'generatedReason',
      'submittedAt',
    ],
    defaultPayload: {
      userId: 'UUID_USER',
      topicId: 'UUID_TOPIC',
      sourceSessionId: 'UUID_SESSION',
      status: GENERATED_STATUSES[0],
      totalQuestions: 5,
      score: 0,
      generatedReason: GENERATED_REASONS[0],
    },
  },
  {
    key: 'test-answers',
    label: 'Respuestas Test',
    description: 'Respuestas de usuarios a reactivos.',
    writableFields: ['generatedTestId', 'questionId', 'userAnswer', 'isCorrect', 'feedbackText', 'answeredAt'],
    defaultPayload: {
      generatedTestId: 'UUID_GENERATED_TEST',
      questionId: 'UUID_QUESTION',
      userAnswer: 'went',
      isCorrect: true,
      feedbackText: 'Correcto',
    },
  },
  {
    key: 'skill-progress',
    label: 'Progreso Skill',
    description: 'Mastery por habilidad/tema.',
    writableFields: ['userId', 'skillId', 'topicId', 'masteryLevel', 'lastScore', 'lastPracticedAt'],
    defaultPayload: {
      userId: 'UUID_USER',
      skillId: 'UUID_SKILL',
      topicId: 'UUID_TOPIC',
      masteryLevel: 25,
      lastScore: 40,
    },
  },
];

export const RESOURCE_MAP: Record<ResourceKey, ResourceConfig> = RESOURCE_CONFIGS.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<ResourceKey, ResourceConfig>,
);

export function isResourceKey(value: string): value is ResourceKey {
  return Object.hasOwn(RESOURCE_MAP, value);
}

export function pickWritableFields(
  source: Record<string, unknown>,
  writableFields: string[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of writableFields) {
    if (Object.hasOwn(source, field)) {
      payload[field] = source[field];
    }
  }

  return payload;
}
