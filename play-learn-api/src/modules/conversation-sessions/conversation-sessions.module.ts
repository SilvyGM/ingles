import { Module } from '@nestjs/common';
import { ConversationSessionsController } from './conversation-sessions.controller';
import { ConversationSessionsService } from './conversation-sessions.service';

@Module({
  controllers: [ConversationSessionsController],
  providers: [ConversationSessionsService],
})
export class ConversationSessionsModule {}
