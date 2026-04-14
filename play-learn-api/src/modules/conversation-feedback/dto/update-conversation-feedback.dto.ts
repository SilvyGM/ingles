import { PartialType } from '@nestjs/swagger';
import { CreateConversationFeedbackDto } from './create-conversation-feedback.dto';

export class UpdateConversationFeedbackDto extends PartialType(
  CreateConversationFeedbackDto,
) {}
