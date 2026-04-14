import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { LANGUAGE_LEVELS } from '../../../common/constants/domain.constants';

export class AnalyzeTurnDto {
  @ApiProperty()
  @IsUUID()
  sessionId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1200)
  userMessage: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  topicName?: string;

  @ApiPropertyOptional({ enum: LANGUAGE_LEVELS })
  @IsOptional()
  @IsIn(LANGUAGE_LEVELS)
  learnerLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  turnIndex?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  transcript?: string[];
}
