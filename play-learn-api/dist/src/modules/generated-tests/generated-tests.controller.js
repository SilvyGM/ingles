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
exports.GeneratedTestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/auth/decorators/public.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_generated_test_dto_1 = require("./dto/create-generated-test.dto");
const update_generated_test_dto_1 = require("./dto/update-generated-test.dto");
const generated_tests_service_1 = require("./generated-tests.service");
let GeneratedTestsController = class GeneratedTestsController {
    generatedTestsService;
    constructor(generatedTestsService) {
        this.generatedTestsService = generatedTestsService;
    }
    create(createGeneratedTestDto) {
        return this.generatedTestsService.create(createGeneratedTestDto);
    }
    findAll() {
        return this.generatedTestsService.findAll();
    }
    findOne(id) {
        return this.generatedTestsService.findOne(id);
    }
    update(id, updateGeneratedTestDto) {
        return this.generatedTestsService.update(id, updateGeneratedTestDto);
    }
    remove(id) {
        return this.generatedTestsService.remove(id);
    }
};
exports.GeneratedTestsController = GeneratedTestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear test generado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_generated_test_dto_1.CreateGeneratedTestDto]),
    __metadata("design:returntype", void 0)
], GeneratedTestsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tests generados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeneratedTestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener test generado por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeneratedTestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar test generado' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_generated_test_dto_1.UpdateGeneratedTestDto]),
    __metadata("design:returntype", void 0)
], GeneratedTestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar test generado' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeneratedTestsController.prototype, "remove", null);
exports.GeneratedTestsController = GeneratedTestsController = __decorate([
    (0, swagger_1.ApiTags)('generated-tests'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('generated-tests'),
    __metadata("design:paramtypes", [generated_tests_service_1.GeneratedTestsService])
], GeneratedTestsController);
//# sourceMappingURL=generated-tests.controller.js.map