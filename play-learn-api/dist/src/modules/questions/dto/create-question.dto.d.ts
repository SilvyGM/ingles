export declare class CreateQuestionDto {
    topicId: string;
    skillId: string;
    questionType: string;
    promptText: string;
    correctAnswer: string;
    difficultyLevel: string;
    explanationText?: string;
    isActive?: boolean;
}
