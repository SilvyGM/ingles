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
exports.CreateGeneratedTestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const domain_constants_1 = require("../../../common/constants/domain.constants");
class CreateGeneratedTestDto {
    userId;
    topicId;
    sourceSessionId;
    status;
    totalQuestions;
    score;
    generatedReason;
    submittedAt;
}
exports.CreateGeneratedTestDto = CreateGeneratedTestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "topicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "sourceSessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: domain_constants_1.GENERATED_TEST_STATUSES, default: 'generated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(domain_constants_1.GENERATED_TEST_STATUSES),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGeneratedTestDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateGeneratedTestDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: domain_constants_1.GENERATED_TEST_REASONS }),
    (0, class_validator_1.IsIn)(domain_constants_1.GENERATED_TEST_REASONS),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "generatedReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGeneratedTestDto.prototype, "submittedAt", void 0);
//# sourceMappingURL=create-generated-test.dto.js.map