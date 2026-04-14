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
exports.ConversationSessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/auth/decorators/public.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const create_conversation_session_dto_1 = require("./dto/create-conversation-session.dto");
const update_conversation_session_dto_1 = require("./dto/update-conversation-session.dto");
const conversation_sessions_service_1 = require("./conversation-sessions.service");
let ConversationSessionsController = class ConversationSessionsController {
    conversationSessionsService;
    constructor(conversationSessionsService) {
        this.conversationSessionsService = conversationSessionsService;
    }
    create(createConversationSessionDto) {
        return this.conversationSessionsService.create(createConversationSessionDto);
    }
    findAll() {
        return this.conversationSessionsService.findAll();
    }
    findOne(id) {
        return this.conversationSessionsService.findOne(id);
    }
    update(id, updateConversationSessionDto) {
        return this.conversationSessionsService.update(id, updateConversationSessionDto);
    }
    remove(id) {
        return this.conversationSessionsService.remove(id);
    }
};
exports.ConversationSessionsController = ConversationSessionsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear sesion de conversacion' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_session_dto_1.CreateConversationSessionDto]),
    __metadata("design:returntype", void 0)
], ConversationSessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar sesiones de conversacion' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConversationSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener sesion de conversacion por id' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConversationSessionsController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar sesion de conversacion' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_conversation_session_dto_1.UpdateConversationSessionDto]),
    __metadata("design:returntype", void 0)
], ConversationSessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar sesion de conversacion' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConversationSessionsController.prototype, "remove", null);
exports.ConversationSessionsController = ConversationSessionsController = __decorate([
    (0, swagger_1.ApiTags)('conversation-sessions'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('conversation-sessions'),
    __metadata("design:paramtypes", [conversation_sessions_service_1.ConversationSessionsService])
], ConversationSessionsController);
//# sourceMappingURL=conversation-sessions.controller.js.map