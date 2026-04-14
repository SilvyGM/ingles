import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'grammar_past_simple' })
  @IsString()
  @MaxLength(60)
  code: string;

  @ApiProperty({ example: 'Pasado Simple' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'grammar' })
  @IsString()
  @MaxLength(80)
  category: string;

  @ApiPropertyOptional({
    example: 'Construccion de oraciones en pasado simple.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
