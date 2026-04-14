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
exports.TopicsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/auth/decorators/public.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_topic_dto_1 = require("./dto/create-topic.dto");
const update_topic_dto_1 = require("./dto/update-topic.dto");
const topics_service_1 = require("./topics.service");
let TopicsController = class TopicsController {
    topicsService;
    constructor(topicsService) {
        this.topicsService = topicsService;
    }
    create(createTopicDto) {
        return this.topicsService.create(createTopicDto);
    }
    findAll() {
        return this.topicsService.findAll();
    }
    findOne(id) {
        return this.topicsService.findOne(id);
    }
    update(id, updateTopicDto) {
        return this.topicsService.update(id, updateTopicDto);
    }
    remove(id) {
        return this.topicsService.remove(id);
    }
};
exports.TopicsController = TopicsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear tema de conversacion' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_topic_dto_1.CreateTopicDto]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar temas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener tema por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar tema' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_topic_dto_1.UpdateTopicDto]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar tema' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "remove", null);
exports.TopicsController = TopicsController = __decorate([
    (0, swagger_1.ApiTags)('topics'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('topics'),
    __metadata("design:paramtypes", [topics_service_1.TopicsService])
], TopicsController);
//# sourceMappingURL=topics.controller.js.map