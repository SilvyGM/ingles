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
exports.GeneratedTestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let GeneratedTestsService = class GeneratedTestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createGeneratedTestDto) {
        return this.prisma.generatedTest.create({
            data: {
                userId: createGeneratedTestDto.userId,
                topicId: createGeneratedTestDto.topicId,
                sourceSessionId: createGeneratedTestDto.sourceSessionId,
                status: createGeneratedTestDto.status ??
                    client_1.GeneratedTestStatus.generated,
                totalQuestions: createGeneratedTestDto.totalQuestions ?? 0,
                score: createGeneratedTestDto.score,
                generatedReason: createGeneratedTestDto.generatedReason,
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
    async findOne(id) {
        const generatedTest = await this.prisma.generatedTest.findUnique({
            where: { id },
            include: { testAnswers: true },
        });
        if (!generatedTest) {
            throw new common_1.NotFoundException(`Generated test ${id} not found`);
        }
        return generatedTest;
    }
    async update(id, updateGeneratedTestDto) {
        await this.findOne(id);
        return this.prisma.generatedTest.update({
            where: { id },
            data: {
                userId: updateGeneratedTestDto.userId,
                topicId: updateGeneratedTestDto.topicId,
                sourceSessionId: updateGeneratedTestDto.sourceSessionId,
                status: updateGeneratedTestDto.status,
                totalQuestions: updateGeneratedTestDto.totalQuestions,
                score: updateGeneratedTestDto.score,
                generatedReason: updateGeneratedTestDto.generatedReason,
                submittedAt: updateGeneratedTestDto.submittedAt,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.generatedTest.delete({ where: { id } });
    }
};
exports.GeneratedTestsService = GeneratedTestsService;
exports.GeneratedTestsService = GeneratedTestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeneratedTestsService);
//# sourceMappingURL=generated-tests.service.js.map