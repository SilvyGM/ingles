import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  FEEDBACK_TYPES,
  SEVERITY_LEVELS,
} from '../../../common/constants/domain.constants';

export class CreateConversationFeedbackDto {
  @ApiProperty()
  @IsUUID()
  sessionId: string;

  @ApiProperty({ enum: FEEDBACK_TYPES })
  @IsIn(FEEDBACK_TYPES)
  feedbackType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourceFragment?: string;

  @ApiProperty({ example: 'Uso incorrecto del pasado simple.' })
  @IsString()
  detectedIssue: string;

  @ApiPropertyOptional({ example: 'Try using worked instead of work.' })
  @IsOptional()
  @IsString()
  suggestedCorrection?: string;

  @ApiProperty({ enum: SEVERITY_LEVELS })
  @IsIn(SEVERITY_LEVELS)
  severity: string;
}
