import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTestAnswerDto {
  @ApiProperty()
  @IsUUID()
  generatedTestId: string;

  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAnswer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedbackText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  answeredAt?: string;
}
