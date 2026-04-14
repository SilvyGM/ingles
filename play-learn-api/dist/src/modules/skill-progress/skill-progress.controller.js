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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/auth/decorators/public.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_skill_progress_dto_1 = require("./dto/create-skill-progress.dto");
const update_skill_progress_dto_1 = require("./dto/update-skill-progress.dto");
const skill_progress_service_1 = require("./skill-progress.service");
let SkillProgressController = class SkillProgressController {
    skillProgressService;
    constructor(skillProgressService) {
        this.skillProgressService = skillProgressService;
    }
    create(createSkillProgressDto) {
        return this.skillProgressService.create(createSkillProgressDto);
    }
    findAll() {
        return this.skillProgressService.findAll();
    }
    findOne(id) {
        return this.skillProgressService.findOne(id);
    }
    update(id, updateSkillProgressDto) {
        return this.skillProgressService.update(id, updateSkillProgressDto);
    }
    remove(id) {
        return this.skillProgressService.remove(id);
    }
};
exports.SkillProgressController = SkillProgressController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro de progreso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_progress_dto_1.CreateSkillProgressDto]),
    __metadata("design:returntype", void 0)
], SkillProgressController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar progreso por habilidad' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SkillProgressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener progreso por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillProgressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar progreso por habilidad' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_skill_progress_dto_1.UpdateSkillProgressDto]),
    __metadata("design:returntype", void 0)
], SkillProgressController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar progreso por habilidad' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillProgressController.prototype, "remove", null);
exports.SkillProgressController = SkillProgressController = __decorate([
    (0, swagger_1.ApiTags)('skill-progress'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('skill-progress'),
    __metadata("design:paramtypes", [skill_progress_service_1.SkillProgressService])
], SkillProgressController);
//# sourceMappingURL=skill-progress.controller.js.map