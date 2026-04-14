import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  LANGUAGE_LEVELS,
  QUESTION_TYPES,
} from '../../../common/constants/domain.constants';

export class CreateQuestionDto {
  @ApiProperty()
  @IsUUID()
  topicId: string;

  @ApiProperty()
  @IsUUID()
  skillId: string;

  @ApiProperty({ enum: QUESTION_TYPES })
  @IsIn(QUESTION_TYPES)
  questionType: string;

  @ApiProperty()
  @IsString()
  promptText: string;

  @ApiProperty()
  @IsString()
  correctAnswer: string;

  @ApiProperty({ enum: LANGUAGE_LEVELS })
  @IsIn(LANGUAGE_LEVELS)
  difficultyLevel: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanationText?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
