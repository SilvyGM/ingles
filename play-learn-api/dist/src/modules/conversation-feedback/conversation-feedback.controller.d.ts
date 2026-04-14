import { CreateConversationFeedbackDto } from './dto/create-conversation-feedback.dto';
import { UpdateConversationFeedbackDto } from './dto/update-conversation-feedback.dto';
import { ConversationFeedbackService } from './conversation-feedback.service';
export declare class ConversationFeedbackController {
    private readonly conversationFeedbackService;
    constructor(conversationFeedbackService: ConversationFeedbackService);
    create(createConversationFeedbackDto: CreateConversationFeedbackDto): import("@prisma/client").Prisma.Prisma__ConversationFeedbackClient<{
        sessionId: string;
        id: string;
        createdAt: Date;
        feedbackType: string;
        sourceFragment: string | null;
        detectedIssue: string;
        suggestedCorrection: string | null;
        severity: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        sessionId: string;
        id: string;
        createdAt: Date;
        feedbackType: string;
        sourceFragment: string | null;
        detectedIssue: string;
        suggestedCorrection: string | null;
        severity: string;
    }[]>;
    findOne(id: string): Promise<{
        sessionId: string;
        id: string;
        createdAt: Date;
        feedbackType: string;
        sourceFragment: string | null;
        detectedIssue: string;
        suggestedCorrection: string | null;
        severity: string;
    }>;
    update(id: string, updateConversationFeedbackDto: UpdateConversationFeedbackDto): Promise<{
        sessionId: string;
        id: string;
        createdAt: Date;
        feedbackType: string;
        sourceFragment: string | null;
        detectedIssue: string;
        suggestedCorrection: string | null;
        severity: string;
    }>;
    remove(id: string): Promise<{
        sessionId: string;
        id: string;
        createdAt: Date;
        feedbackType: string;
        sourceFragment: string | null;
        detectedIssue: string;
        suggestedCorrection: string | null;
        severity: string;
    }>;
}
