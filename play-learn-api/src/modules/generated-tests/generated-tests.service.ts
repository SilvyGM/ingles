import { Injectable, NotFoundException } from '@nestjs/common';
import { GeneratedReason, GeneratedTestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGeneratedTestDto } from './dto/create-generated-test.dto';
import { UpdateGeneratedTestDto } from './dto/update-generated-test.dto';

@Injectable()
export class GeneratedTestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGeneratedTestDto: CreateGeneratedTestDto) {
    return this.prisma.generatedTest.create({
      data: {
        userId: createGeneratedTestDto.userId,
        topicId: createGeneratedTestDto.topicId,
        sourceSessionId: createGeneratedTestDto.sourceSessionId,
        status:
          (createGeneratedTestDto.status as GeneratedTestStatus | undefined) ??
          GeneratedTestStatus.generated,
        totalQuestions: createGeneratedTestDto.totalQuestions ?? 0,
        score: createGeneratedTestDto.score,
        generatedReason:
          createGeneratedTestDto.generatedReason as GeneratedReason,
        submittedAt: createGeneratedTestDto.submittedAt,
      },
    });
  }

  findAll() {
    return this.prisma.generatedTest.findMany({
      include: { testAnswers: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const generatedTest = await this.prisma.generatedTest.findUnique({
      where: { id },
      include: { testAnswers: true },
    });

    if (!generatedTest) {
      throw new NotFoundException(`Generated test ${id} not found`);
    }

    return generatedTest;
  }

  async update(id: string, updateGeneratedTestDto: UpdateGeneratedTestDto) {
    await this.findOne(id);

    return this.prisma.generatedTest.update({
      where: { id },
      data: {
        userId: updateGeneratedTestDto.userId,
        topicId: updateGeneratedTestDto.topicId,
        sourceSessionId: updateGeneratedTestDto.sourceSessionId,
        status: updateGeneratedTestDto.status as
          | GeneratedTestStatus
          | undefined,
        totalQuestions: updateGeneratedTestDto.totalQuestions,
        score: updateGeneratedTestDto.score,
        generatedReason: updateGeneratedTestDto.generatedReason as
          | GeneratedReason
          | undefined,
        submittedAt: updateGeneratedTestDto.submittedAt,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.generatedTest.delete({ where: { id } });
  }
}
