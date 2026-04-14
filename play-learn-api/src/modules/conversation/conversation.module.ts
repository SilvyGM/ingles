import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { MockConversationAiService } from './mock-conversation-ai.service';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, MockConversationAiService],
})
export class ConversationModule {}
