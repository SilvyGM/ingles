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
exports.CreateConversationFeedbackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const domain_constants_1 = require("../../../common/constants/domain.constants");
class CreateConversationFeedbackDto {
    sessionId;
    feedbackType;
    sourceFragment;
    detectedIssue;
    suggestedCorrection;
    severity;
}
exports.CreateConversationFeedbackDto = CreateConversationFeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: domain_constants_1.FEEDBACK_TYPES }),
    (0, class_validator_1.IsIn)(domain_constants_1.FEEDBACK_TYPES),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "feedbackType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "sourceFragment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Uso incorrecto del pasado simple.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "detectedIssue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Try using worked instead of work.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "suggestedCorrection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: domain_constants_1.SEVERITY_LEVELS }),
    (0, class_validator_1.IsIn)(domain_constants_1.SEVERITY_LEVELS),
    __metadata("design:type", String)
], CreateConversationFeedbackDto.prototype, "severity", void 0);
//# sourceMappingURL=create-conversation-feedback.dto.js.map