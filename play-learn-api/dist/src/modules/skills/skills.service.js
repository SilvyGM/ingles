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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SkillsService = class SkillsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createSkillDto) {
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
    async findOne(id) {
        const skill = await this.prisma.skill.findUnique({ where: { id } });
        if (!skill) {
            throw new common_1.NotFoundException(`Skill ${id} not found`);
        }
        return skill;
    }
    async update(id, updateSkillDto) {
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.skill.delete({ where: { id } });
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillsService);
//# sourceMappingURL=skills.service.js.map