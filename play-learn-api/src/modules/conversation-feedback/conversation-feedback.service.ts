import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackType, SeverityLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationFeedbackDto } from './dto/create-conversation-feedback.dto';
import { UpdateConversationFeedbackDto } from './dto/update-conversation-feedback.dto';

@Injectable()
export class ConversationFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  create(createConversationFeedbackDto: CreateConversationFeedbackDto) {
    return this.prisma.conversationFeedback.create({
      data: {
        sessionId: createConversationFeedbackDto.sessionId,
        feedbackType:
          createConversationFeedbackDto.feedbackType as FeedbackType,
        sourceFragment: createConversationFeedbackDto.sourceFragment,
        detectedIssue: createConversationFeedbackDto.detectedIssue,
        suggestedCorrection: createConversationFeedbackDto.suggestedCorrection,
        severity: createConversationFeedbackDto.severity as SeverityLevel,
      },
    });
  }

  findAll() {
    return this.prisma.conversationFeedback.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const feedback = await this.prisma.conversationFeedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Conversation feedback ${id} not found`);
    }

    return feedback;
  }

  async update(
    id: string,
    updateConversationFeedbackDto: UpdateConversationFeedbackDto,
  ) {
    await this.findOne(id);

    return this.prisma.conversationFeedback.update({
      where: { id },
      data: {
        sessionId: updateConversationFeedbackDto.sessionId,
        feedbackType: updateConversationFeedbackDto.feedbackType as
          | FeedbackType
          | undefined,
        sourceFragment: updateConversationFeedbackDto.sourceFragment,
        detectedIssue: updateConversationFeedbackDto.detectedIssue,
        suggestedCorrection: updateConversationFeedbackDto.suggestedCorrection,
        severity: updateConversationFeedbackDto.severity as
          | SeverityLevel
          | undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.conversationFeedback.delete({ where: { id } });
  }
}
