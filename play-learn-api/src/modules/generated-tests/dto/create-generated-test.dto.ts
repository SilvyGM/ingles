import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  GENERATED_TEST_REASONS,
  GENERATED_TEST_STATUSES,
} from '../../../common/constants/domain.constants';

export class CreateGeneratedTestDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  topicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sourceSessionId?: string;

  @ApiPropertyOptional({ enum: GENERATED_TEST_STATUSES, default: 'generated' })
  @IsOptional()
  @IsIn(GENERATED_TEST_STATUSES)
  status?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalQuestions?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiProperty({ enum: GENERATED_TEST_REASONS })
  @IsIn(GENERATED_TEST_REASONS)
  generatedReason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  submittedAt?: string;
}
