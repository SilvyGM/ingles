export type LlmAnalysis = {
    assistantReply: string;
    feedbackType: string;
    detectedIssue: string;
    suggestedCorrection: string;
    severity: string;
    fluencyScore: number;
    pronunciationScore: number;
    grammarScore: number;
};
