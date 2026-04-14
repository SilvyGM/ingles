import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload, UserRole } from '../../common/auth/auth.types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(loginDto: LoginDto) {
    const role = this.resolveRole(loginDto.email, loginDto.password);

    if (!role) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const payload: JwtPayload = {
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

  private resolveRole(email: string, password: string): UserRole | null {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@playlearn.app').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

    if (normalizedEmail === adminEmail && normalizedPassword === adminPassword) {
      return 'admin';
    }

    return null;
  }
}
