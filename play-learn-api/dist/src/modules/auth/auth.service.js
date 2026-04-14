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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    login(loginDto) {
        const role = this.resolveRole(loginDto.email, loginDto.password);
        if (!role) {
            throw new common_1.UnauthorizedException('Credenciales invalidas.');
        }
        const payload = {
            sub: loginDto.email.toLowerCase(),
            email: loginDto.email.toLowerCase(),
            role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            role,
            email: payload.email,
            tokenType: 'Bearer',
        };
    }
    resolveRole(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@playlearn.app').toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
        if (normalizedEmail === adminEmail && normalizedPassword === adminPassword) {
            return 'admin';
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map