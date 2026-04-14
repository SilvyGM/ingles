import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillProgressDto } from './dto/create-skill-progress.dto';
import { UpdateSkillProgressDto } from './dto/update-skill-progress.dto';

@Injectable()
export class SkillProgressService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSkillProgressDto: CreateSkillProgressDto) {
    return this.prisma.skillProgress.create({
      data: {
        userId: createSkillProgressDto.userId,
        skillId: createSkillProgressDto.skillId,
        topicId: createSkillProgressDto.topicId,
        masteryLevel: createSkillProgressDto.masteryLevel ?? 0,
        lastScore: createSkillProgressDto.lastScore,
        lastPracticedAt: createSkillProgressDto.lastPracticedAt,
      },
    });
  }

  findAll() {
    return this.prisma.skillProgress.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const skillProgress = await this.prisma.skillProgress.findUnique({
      where: { id },
    });

    if (!skillProgress) {
      throw new NotFoundException(`Skill progress ${id} not found`);
    }

    return skillProgress;
  }

  async update(id: string, updateSkillProgressDto: UpdateSkillProgressDto) {
    await this.findOne(id);

    return this.prisma.skillProgress.update({
      where: { id },
      data: {
        userId: updateSkillProgressDto.userId,
        skillId: updateSkillProgressDto.skillId,
        topicId: updateSkillProgressDto.topicId,
        masteryLevel: updateSkillProgressDto.masteryLevel,
        lastScore: updateSkillProgressDto.lastScore,
        lastPracticedAt: updateSkillProgressDto.lastPracticedAt,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.skillProgress.delete({ where: { id } });
  }
}
