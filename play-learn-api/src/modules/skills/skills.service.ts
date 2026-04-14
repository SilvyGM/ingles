import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        code: createSkillDto.code,
        name: createSkillDto.name,
        category: createSkillDto.category,
        description: createSkillDto.description,
        isActive: createSkillDto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id);

    return this.prisma.skill.update({
      where: { id },
      data: {
        code: updateSkillDto.code,
        name: updateSkillDto.name,
        category: updateSkillDto.category,
        description: updateSkillDto.description,
        isActive: updateSkillDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.skill.delete({ where: { id } });
  }
}
