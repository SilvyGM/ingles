"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationFeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConversationFeedbackService = class ConversationFeedbackService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createConversationFeedbackDto) {
        return this.prisma.conversationFeedback.create({
            data: {
                sessionId: createConversationFeedbackDto.sessionId,
                feedbackType: createConversationFeedbackDto.feedbackType,
                sourceFragment: createConversationFeedbackDto.sourceFragment,
                detectedIssue: createConversationFeedbackDto.detectedIssue,
                suggestedCorrection: createConversationFeedbackDto.suggestedCorrection,
                severity: createConversationFeedbackDto.severity,
            },
        });
    }
    findAll() {
        return this.prisma.conversationFeedback.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const feedback = await this.prisma.conversationFeedback.findUnique({
            where: { id },
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`Conversation feedback ${id} not found`);
        }
        return feedback;
    }
    async update(id, updateConversationFeedbackDto) {
        await this.findOne(id);
        return this.prisma.conversationFeedback.update({
            where: { id },
            data: {
                sessionId: updateConversationFeedbackDto.sessionId,
                feedbackType: updateConversationFeedbackDto.feedbackType,
                sourceFragment: updateConversationFeedbackDto.sourceFragment,
                detectedIssue: updateConversationFeedbackDto.detectedIssue,
                suggestedCorrection: updateConversationFeedbackDto.suggestedCorrection,
                severity: updateConversationFeedbackDto.severity,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.conversationFeedback.delete({ where: { id } });
    }
};
exports.ConversationFeedbackService = ConversationFeedbackService;
exports.ConversationFeedbackService = ConversationFeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationFeedbackService);
//# sourceMappingURL=conversation-feedback.service.js.map