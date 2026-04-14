import { PartialType } from '@nestjs/swagger';
import { CreateConversationSessionDto } from './create-conversation-session.dto';

export class UpdateConversationSessionDto extends PartialType(
  CreateConversationSessionDto,
) {}
