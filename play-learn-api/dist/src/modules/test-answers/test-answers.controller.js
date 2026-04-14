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
exports.TestAnswersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_test_answer_dto_1 = require("./dto/create-test-answer.dto");
const update_test_answer_dto_1 = require("./dto/update-test-answer.dto");
const test_answers_service_1 = require("./test-answers.service");
let TestAnswersController = class TestAnswersController {
    testAnswersService;
    constructor(testAnswersService) {
        this.testAnswersService = testAnswersService;
    }
    create(createTestAnswerDto) {
        return this.testAnswersService.create(createTestAnswerDto);
    }
    findAll() {
        return this.testAnswersService.findAll();
    }
    findOne(id) {
        return this.testAnswersService.findOne(id);
    }
    update(id, updateTestAnswerDto) {
        return this.testAnswersService.update(id, updateTestAnswerDto);
    }
    remove(id) {
        return this.testAnswersService.remove(id);
    }
};
exports.TestAnswersController = TestAnswersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear respuesta de test' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_test_answer_dto_1.CreateTestAnswerDto]),
    __metadata("design:returntype", void 0)
], TestAnswersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar respuestas de test' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestAnswersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener respuesta de test por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestAnswersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar respuesta de test' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_test_answer_dto_1.UpdateTestAnswerDto]),
    __metadata("design:returntype", void 0)
], TestAnswersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar respuesta de test' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestAnswersController.prototype, "remove", null);
exports.TestAnswersController = TestAnswersController = __decorate([
    (0, swagger_1.ApiTags)('test-answers'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('test-answers'),
    __metadata("design:paramtypes", [test_answers_service_1.TestAnswersService])
], TestAnswersController);
//# sourceMappingURL=test-answers.controller.js.map