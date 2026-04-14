export type BasicEntity = {
  id: string;
  name?: string;
  fullName?: string;
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
  userId: string;
  topicId?: string | null;
  generatedReason: string;
  totalQuestions: number;
  status: string;
};

export type SkillProgressEntity = {
  id: string;
  userId: string;
  topicId?: string | null;
  masteryLevel: number | string;
  lastScore?: number | string | null;
  updatedAt: string;
};

export type SessionCompletionState = {
  users: BasicEntity[];
  topics: BasicEntity[];
  selectedUserId: string;
  selectedTopicId: string;
  sessionId: string;
  overallScore: string;
  fluencyScore: string;
  pronunciationScore: string;
  grammarScore: string;
  transcriptText: string;
  feedbackType: string;
  feedbackSeverity: string;
  feedbackIssue: string;
  feedbackSuggestion: string;
  generatedTest: GeneratedTestEntity | null;
  skillProgress: SkillProgressEntity | null;
  status: string;
  busy: boolean;
};
