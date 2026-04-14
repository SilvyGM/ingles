import { Module } from '@nestjs/common';
import { SkillProgressController } from './skill-progress.controller';
import { SkillProgressService } from './skill-progress.service';

@Module({
  controllers: [SkillProgressController],
  providers: [SkillProgressService],
})
export class SkillProgressModule {}
