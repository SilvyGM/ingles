import { PartialType } from '@nestjs/swagger';
import { CreateGeneratedTestDto } from './create-generated-test.dto';

export class UpdateGeneratedTestDto extends PartialType(
  CreateGeneratedTestDto,
) {}
