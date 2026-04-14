import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';
import { TestAnswersService } from './test-answers.service';
export declare class TestAnswersController {
    private readonly testAnswersService;
    constructor(testAnswersService: TestAnswersService);
    create(createTestAnswerDto: CreateTestAnswerDto): import("@prisma/client").Prisma.Prisma__TestAnswerClient<{
        id: string;
        generatedTestId: string;
        questionId: string;
        userAnswer: string | null;
        isCorrect: boolean | null;
        feedbackText: string | null;
        answeredAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        generatedTestId: string;
        questionId: string;
        userAnswer: string | null;
        isCorrect: boolean | null;
        feedbackText: string | null;
        answeredAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        generatedTestId: string;
        questionId: string;
        userAnswer: string | null;
        isCorrect: boolean | null;
        feedbackText: string | null;
        answeredAt: Date | null;
    }>;
    update(id: string, updateTestAnswerDto: UpdateTestAnswerDto): Promise<{
        id: string;
        generatedTestId: string;
        questionId: string;
        userAnswer: string | null;
        isCorrect: boolean | null;
        feedbackText: string | null;
        answeredAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        generatedTestId: string;
        questionId: string;
        userAnswer: string | null;
        isCorrect: boolean | null;
        feedbackText: string | null;
        answeredAt: Date | null;
    }>;
}
