export type TopicEntity = {
  id: string;
  name: string;
  category: string;
  difficultyLevel: string;
};

export type UserEntity = {
  id: string;
  email: string;
  fullName: string;
  currentLevel: string;
};

export type SessionEntity = {
  id: string;
  userId: string;
  topicId: string;
  status: string;
};

export type GeneratedTestEntity = {
  id: string;
  sourceSessionId?: string | null;
  totalQuestions: number;
  status: string;
  generatedReason: string;
};

export type SkillProgressEntity = {
  id: string;
  userId: string;
  topicId?: string | null;
  masteryLevel: number | string;
  lastScore?: number | string | null;
  updatedAt: string;
};

export type LearnerStep = 'setup' | 'practice' | 'summary';

export type LearnerState = {
  step: LearnerStep;
  loading: boolean;
  status: string;
  topics: TopicEntity[];
  selectedTopicId: string;
  learnerName: string;
  learnerEmail: string;
  emailLocked: boolean;
  learnerLevel: string;
  learnerUserId: string;
  sessionId: string;
  turnIndex: number;
  currentAnswer: string;
  transcript: string[];
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore: number;
  overallScore: number;
  generatedTest: GeneratedTestEntity | null;
  skillProgress: SkillProgressEntity | null;
};

export type TurnAnalysis = {
  assistantReply: string;
  feedbackType: string;
  detectedIssue: string;
  suggestedCorrection: string;
  severity: string;
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore: number;
};
