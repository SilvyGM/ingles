import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { LANGUAGE_LEVELS } from '../../../common/constants/domain.constants';

export class CreateTopicDto {
  @ApiProperty({ example: 'En el aeropuerto' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'en-el-aeropuerto' })
  @IsString()
  @MaxLength(140)
  slug: string;

  @ApiProperty({ example: 'travel' })
  @IsString()
  @MaxLength(80)
  category: string;

  @ApiProperty({ enum: LANGUAGE_LEVELS, example: 'A2' })
  @IsIn(LANGUAGE_LEVELS)
  difficultyLevel: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
