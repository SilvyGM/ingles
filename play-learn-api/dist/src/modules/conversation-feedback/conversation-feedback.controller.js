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
exports.ConversationFeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_conversation_feedback_dto_1 = require("./dto/create-conversation-feedback.dto");
const update_conversation_feedback_dto_1 = require("./dto/update-conversation-feedback.dto");
const conversation_feedback_service_1 = require("./conversation-feedback.service");
let ConversationFeedbackController = class ConversationFeedbackController {
    conversationFeedbackService;
    constructor(conversationFeedbackService) {
        this.conversationFeedbackService = conversationFeedbackService;
    }
    create(createConversationFeedbackDto) {
        return this.conversationFeedbackService.create(createConversationFeedbackDto);
    }
    findAll() {
        return this.conversationFeedbackService.findAll();
    }
    findOne(id) {
        return this.conversationFeedbackService.findOne(id);
    }
    update(id, updateConversationFeedbackDto) {
        return this.conversationFeedbackService.update(id, updateConversationFeedbackDto);
    }
    remove(id) {
        return this.conversationFeedbackService.remove(id);
    }
};
exports.ConversationFeedbackController = ConversationFeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear feedback de conversacion' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_feedback_dto_1.CreateConversationFeedbackDto]),
    __metadata("design:returntype", void 0)
], ConversationFeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar feedback de conversacion' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConversationFeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener feedback por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConversationFeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar feedback de conversacion' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_conversation_feedback_dto_1.UpdateConversationFeedbackDto]),
    __metadata("design:returntype", void 0)
], ConversationFeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar feedback de conversacion' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConversationFeedbackController.prototype, "remove", null);
exports.ConversationFeedbackController = ConversationFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('conversation-feedback'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('conversation-feedback'),
    __metadata("design:paramtypes", [conversation_feedback_service_1.ConversationFeedbackService])
], ConversationFeedbackController);
//# sourceMappingURL=conversation-feedback.controller.js.map