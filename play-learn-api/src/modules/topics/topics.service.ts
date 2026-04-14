import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTopicDto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: {
        name: createTopicDto.name,
        slug: createTopicDto.slug,
        category: createTopicDto.category,
        difficultyLevel: createTopicDto.difficultyLevel as LanguageLevel,
        isActive: createTopicDto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.topic.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic ${id} not found`);
    }

    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    await this.findOne(id);

    return this.prisma.topic.update({
      where: { id },
      data: {
        name: updateTopicDto.name,
        slug: updateTopicDto.slug,
        category: updateTopicDto.category,
        difficultyLevel: updateTopicDto.difficultyLevel as
          | LanguageLevel
          | undefined,
        isActive: updateTopicDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.topic.delete({ where: { id } });
  }
}
