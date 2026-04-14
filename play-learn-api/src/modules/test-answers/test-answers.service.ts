import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';

@Injectable()
export class TestAnswersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTestAnswerDto: CreateTestAnswerDto) {
    return this.prisma.testAnswer.create({
      data: {
        generatedTestId: createTestAnswerDto.generatedTestId,
        questionId: createTestAnswerDto.questionId,
        userAnswer: createTestAnswerDto.userAnswer,
        isCorrect: createTestAnswerDto.isCorrect,
        feedbackText: createTestAnswerDto.feedbackText,
        answeredAt: createTestAnswerDto.answeredAt,
      },
    });
  }

  findAll() {
    return this.prisma.testAnswer.findMany({
      orderBy: { answeredAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const answer = await this.prisma.testAnswer.findUnique({ where: { id } });
    if (!answer) {
      throw new NotFoundException(`Test answer ${id} not found`);
    }

    return answer;
  }

  async update(id: string, updateTestAnswerDto: UpdateTestAnswerDto) {
    await this.findOne(id);

    return this.prisma.testAnswer.update({
      where: { id },
      data: {
        generatedTestId: updateTestAnswerDto.generatedTestId,
        questionId: updateTestAnswerDto.questionId,
        userAnswer: updateTestAnswerDto.userAnswer,
        isCorrect: updateTestAnswerDto.isCorrect,
        feedbackText: updateTestAnswerDto.feedbackText,
        answeredAt: updateTestAnswerDto.answeredAt,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.testAnswer.delete({ where: { id } });
  }
}
