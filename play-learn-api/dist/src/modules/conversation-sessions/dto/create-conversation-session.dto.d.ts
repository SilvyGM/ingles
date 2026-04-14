export declare class CreateConversationSessionDto {
    userId: string;
    topicId: string;
    status?: string;
    startedAt?: string;
    endedAt?: string;
    transcriptText?: string;
    fluencyScore?: number;
    pronunciationScore?: number;
    grammarScore?: number;
    overallScore?: number;
    audioUrl?: string;
}
