import { CreateGeneratedTestDto } from './dto/create-generated-test.dto';
import { UpdateGeneratedTestDto } from './dto/update-generated-test.dto';
import { GeneratedTestsService } from './generated-tests.service';
export declare class GeneratedTestsController {
    private readonly generatedTestsService;
    constructor(generatedTestsService: GeneratedTestsService);
    create(createGeneratedTestDto: CreateGeneratedTestDto): import("@prisma/client").Prisma.Prisma__GeneratedTestClient<{
        id: string;
        userId: string;
        topicId: string | null;
        status: string;
        createdAt: Date;
        sourceSessionId: string | null;
        totalQuestions: number;
        score: import("@prisma/client-runtime-utils").Decimal | null;
        generatedReason: string;
        submittedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        testAnswers: {
            id: string;
            generatedTestId: string;
            questionId: string;
            userAnswer: string | null;
            isCorrect: boolean | null;
            feedbackText: string | null;
            answeredAt: Date | null;
        }[];
    } & {
        id: string;
        userId: string;
        topicId: string | null;
        status: string;
        createdAt: Date;
        sourceSessionId: string | null;
        totalQuestions: number;
        score: import("@prisma/client-runtime-utils").Decimal | null;
        generatedReason: string;
        submittedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        testAnswers: {
            id: string;
            generatedTestId: string;
            questionId: string;
            userAnswer: string | null;
            isCorrect: boolean | null;
            feedbackText: string | null;
            answeredAt: Date | null;
        }[];
    } & {
        id: string;
        userId: string;
        topicId: string | null;
        status: string;
        createdAt: Date;
        sourceSessionId: string | null;
        totalQuestions: number;
        score: import("@prisma/client-runtime-utils").Decimal | null;
        generatedReason: string;
        submittedAt: Date | null;
    }>;
    update(id: string, updateGeneratedTestDto: UpdateGeneratedTestDto): Promise<{
        id: string;
        userId: string;
        topicId: string | null;
        status: string;
        createdAt: Date;
        sourceSessionId: string | null;
        totalQuestions: number;
        score: import("@prisma/client-runtime-utils").Decimal | null;
        generatedReason: string;
        submittedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        topicId: string | null;
        status: string;
        createdAt: Date;
        sourceSessionId: string | null;
        totalQuestions: number;
        score: import("@prisma/client-runtime-utils").Decimal | null;
        generatedReason: string;
        submittedAt: Date | null;
    }>;
}
