import { Module } from '@nestjs/common';
import { ConversationFeedbackController } from './conversation-feedback.controller';
import { ConversationFeedbackService } from './conversation-feedback.service';

@Module({
  controllers: [ConversationFeedbackController],
  providers: [ConversationFeedbackService],
})
export class ConversationFeedbackModule {}
