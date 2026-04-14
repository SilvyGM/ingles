import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageLevel, QuestionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        topicId: createQuestionDto.topicId,
        skillId: createQuestionDto.skillId,
        questionType: createQuestionDto.questionType as QuestionType,
        promptText: createQuestionDto.promptText,
        correctAnswer: createQuestionDto.correctAnswer,
        difficultyLevel: createQuestionDto.difficultyLevel as LanguageLevel,
        explanationText: createQuestionDto.explanationText,
        isActive: createQuestionDto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);

    return this.prisma.question.update({
      where: { id },
      data: {
        topicId: updateQuestionDto.topicId,
        skillId: updateQuestionDto.skillId,
        questionType: updateQuestionDto.questionType as
          | QuestionType
          | undefined,
        promptText: updateQuestionDto.promptText,
        correctAnswer: updateQuestionDto.correctAnswer,
        difficultyLevel: updateQuestionDto.difficultyLevel as
          | LanguageLevel
          | undefined,
        explanationText: updateQuestionDto.explanationText,
        isActive: updateQuestionDto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.question.delete({ where: { id } });
  }
}
