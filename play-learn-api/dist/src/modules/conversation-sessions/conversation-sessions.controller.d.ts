import { CreateConversationSessionDto } from './dto/create-conversation-session.dto';
import { UpdateConversationSessionDto } from './dto/update-conversation-session.dto';
import { ConversationSessionsService } from './conversation-sessions.service';
export declare class ConversationSessionsController {
    private readonly conversationSessionsService;
    constructor(conversationSessionsService: ConversationSessionsService);
    create(createConversationSessionDto: CreateConversationSessionDto): Promise<{
        id: string;
        userId: string;
        topicId: string;
        status: string;
        startedAt: Date;
        endedAt: Date | null;
        transcriptText: string | null;
        fluencyScore: import("@prisma/client-runtime-utils").Decimal | null;
        pronunciationScore: import("@prisma/client-runtime-utils").Decimal | null;
        grammarScore: import("@prisma/client-runtime-utils").Decimal | null;
        overallScore: import("@prisma/client-runtime-utils").Decimal | null;
        audioUrl: string | null;
        createdAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        feedback: {
            sessionId: string;
            id: string;
            createdAt: Date;
            feedbackType: string;
            sourceFragment: string | null;
            detectedIssue: string;
            suggestedCorrection: string | null;
            severity: string;
        }[];
    } & {
        id: string;
        userId: string;
        topicId: string;
        status: string;
        startedAt: Date;
        endedAt: Date | null;
        transcriptText: string | null;
        fluencyScore: import("@prisma/client-runtime-utils").Decimal | null;
        pronunciationScore: import("@prisma/client-runtime-utils").Decimal | null;
        grammarScore: import("@prisma/client-runtime-utils").Decimal | null;
        overallScore: import("@prisma/client-runtime-utils").Decimal | null;
        audioUrl: string | null;
        createdAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        feedback: {
            sessionId: string;
            id: string;
            createdAt: Date;
            feedbackType: string;
            sourceFragment: string | null;
            detectedIssue: string;
            suggestedCorrection: string | null;
            severity: string;
        }[];
        generatedTests: {
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
        }[];
    } & {
        id: string;
        userId: string;
        topicId: string;
        status: string;
        startedAt: Date;
        endedAt: Date | null;
        transcriptText: string | null;
        fluencyScore: import("@prisma/client-runtime-utils").Decimal | null;
        pronunciationScore: import("@prisma/client-runtime-utils").Decimal | null;
        grammarScore: import("@prisma/client-runtime-utils").Decimal | null;
        overallScore: import("@prisma/client-runtime-utils").Decimal | null;
        audioUrl: string | null;
        createdAt: Date;
    }>;
    update(id: string, updateConversationSessionDto: UpdateConversationSessionDto): Promise<{
        id: string;
        userId: string;
        topicId: string;
        status: string;
        startedAt: Date;
        endedAt: Date | null;
        transcriptText: string | null;
        fluencyScore: import("@prisma/client-runtime-utils").Decimal | null;
        pronunciationScore: import("@prisma/client-runtime-utils").Decimal | null;
        grammarScore: import("@prisma/client-runtime-utils").Decimal | null;
        overallScore: import("@prisma/client-runtime-utils").Decimal | null;
        audioUrl: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        topicId: string;
        status: string;
        startedAt: Date;
        endedAt: Date | null;
        transcriptText: string | null;
        fluencyScore: import("@prisma/client-runtime-utils").Decimal | null;
        pronunciationScore: import("@prisma/client-runtime-utils").Decimal | null;
        grammarScore: import("@prisma/client-runtime-utils").Decimal | null;
        overallScore: import("@prisma/client-runtime-utils").Decimal | null;
        audioUrl: string | null;
        createdAt: Date;
    }>;
}
