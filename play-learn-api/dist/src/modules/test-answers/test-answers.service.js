"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAnswersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TestAnswersService = class TestAnswersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createTestAnswerDto) {
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
    async findOne(id) {
        const answer = await this.prisma.testAnswer.findUnique({ where: { id } });
        if (!answer) {
            throw new common_1.NotFoundException(`Test answer ${id} not found`);
        }
        return answer;
    }
    async update(id, updateTestAnswerDto) {
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.testAnswer.delete({ where: { id } });
    }
};
exports.TestAnswersService = TestAnswersService;
exports.TestAnswersService = TestAnswersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestAnswersService);
//# sourceMappingURL=test-answers.service.js.map