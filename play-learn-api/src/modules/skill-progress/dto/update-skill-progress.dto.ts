import { PartialType } from '@nestjs/swagger';
import { CreateSkillProgressDto } from './create-skill-progress.dto';

export class UpdateSkillProgressDto extends PartialType(
  CreateSkillProgressDto,
) {}
