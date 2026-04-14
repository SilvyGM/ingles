import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createQuestionDto: CreateQuestionDto): import("@prisma/client").Prisma.Prisma__QuestionClient<{
        id: string;
        topicId: string;
        createdAt: Date;
        isActive: boolean;
        skillId: string;
        questionType: string;
        promptText: string;
        correctAnswer: string;
        difficultyLevel: string;
        explanationText: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        topicId: string;
        createdAt: Date;
        isActive: boolean;
        skillId: string;
        questionType: string;
        promptText: string;
        correctAnswer: string;
        difficultyLevel: string;
        explanationText: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        topicId: string;
        createdAt: Date;
        isActive: boolean;
        skillId: string;
        questionType: string;
        promptText: string;
        correctAnswer: string;
        difficultyLevel: string;
        explanationText: string | null;
    }>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        id: string;
        topicId: string;
        createdAt: Date;
        isActive: boolean;
        skillId: string;
        questionType: string;
        promptText: string;
        correctAnswer: string;
        difficultyLevel: string;
        explanationText: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        topicId: string;
        createdAt: Date;
        isActive: boolean;
        skillId: string;
        questionType: string;
        promptText: string;
        correctAnswer: string;
        difficultyLevel: string;
        explanationText: string | null;
    }>;
}
