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
exports.AnalyzeTurnDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const domain_constants_1 = require("../../../common/constants/domain.constants");
class AnalyzeTurnDto {
    sessionId;
    userMessage;
    topicName;
    learnerLevel;
    turnIndex;
    transcript;
}
exports.AnalyzeTurnDto = AnalyzeTurnDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AnalyzeTurnDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1200),
    __metadata("design:type", String)
], AnalyzeTurnDto.prototype, "userMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], AnalyzeTurnDto.prototype, "topicName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: domain_constants_1.LANGUAGE_LEVELS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(domain_constants_1.LANGUAGE_LEVELS),
    __metadata("design:type", String)
], AnalyzeTurnDto.prototype, "learnerLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], AnalyzeTurnDto.prototype, "turnIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyzeTurnDto.prototype, "transcript", void 0);
//# sourceMappingURL=analyze-turn.dto.js.map