import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { LANGUAGE_LEVELS } from '../../../common/constants/domain.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'demo@playlearn.app' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Demo Student' })
  @IsString()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @MaxLength(10)
  targetLanguage: string;

  @ApiProperty({ enum: LANGUAGE_LEVELS, example: 'A2' })
  @IsIn(LANGUAGE_LEVELS)
  currentLevel: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  xpTotal?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentStreak?: number;
}
