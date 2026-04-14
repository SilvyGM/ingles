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
exports.SkillProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SkillProgressService = class SkillProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createSkillProgressDto) {
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
    async findOne(id) {
        const skillProgress = await this.prisma.skillProgress.findUnique({
            where: { id },
        });
        if (!skillProgress) {
            throw new common_1.NotFoundException(`Skill progress ${id} not found`);
        }
        return skillProgress;
    }
    async update(id, updateSkillProgressDto) {
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.skillProgress.delete({ where: { id } });
    }
};
exports.SkillProgressService = SkillProgressService;
exports.SkillProgressService = SkillProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillProgressService);
//# sourceMappingURL=skill-progress.service.js.map