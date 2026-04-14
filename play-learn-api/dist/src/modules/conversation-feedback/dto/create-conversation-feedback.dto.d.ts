export declare class CreateConversationFeedbackDto {
    sessionId: string;
    feedbackType: string;
    sourceFragment?: string;
    detectedIssue: string;
    suggestedCorrection?: string;
    severity: string;
}
