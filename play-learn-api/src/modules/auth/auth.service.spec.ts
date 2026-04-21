import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
  });

  describe('login', () => {
    it('debería retornar accessToken y datos del usuario con credenciales de admin por defecto', () => {
      const result = service.login({ email: 'admin@playlearn.app', password: 'admin123' });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        role: 'admin',
        email: 'admin@playlearn.app',
        tokenType: 'Bearer',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'admin@playlearn.app',
        email: 'admin@playlearn.app',
        role: 'admin',
      });
    });

    it('debería normalizar el email a minúsculas', () => {
      const result = service.login({ email: 'ADMIN@PLAYLEARN.APP', password: 'admin123' });

      expect(result.email).toBe('admin@playlearn.app');
      expect(result.role).toBe('admin');
    });

    it('debería lanzar UnauthorizedException con credenciales incorrectas', () => {
      expect(() =>
        service.login({ email: 'wrong@example.com', password: 'wrongpassword' }),
      ).toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException con contraseña incorrecta', () => {
      expect(() =>
        service.login({ email: 'admin@playlearn.app', password: 'wrongpassword' }),
      ).toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException con email incorrecto', () => {
      expect(() =>
        service.login({ email: 'notadmin@playlearn.app', password: 'admin123' }),
      ).toThrow(UnauthorizedException);
    });

    it('debería usar variables de entorno para credenciales de admin', () => {
      process.env.ADMIN_EMAIL = 'custom@admin.com';
      process.env.ADMIN_PASSWORD = 'custompass';

      const result = service.login({ email: 'custom@admin.com', password: 'custompass' });

      expect(result.role).toBe('admin');
      expect(result.email).toBe('custom@admin.com');
    });

    it('debería fallar con credenciales por defecto cuando se configuran variables de entorno distintas', () => {
      process.env.ADMIN_EMAIL = 'custom@admin.com';
      process.env.ADMIN_PASSWORD = 'custompass';

      expect(() =>
        service.login({ email: 'admin@playlearn.app', password: 'admin123' }),
      ).toThrow(UnauthorizedException);
    });

    it('debería retornar tokenType Bearer', () => {
      const result = service.login({ email: 'admin@playlearn.app', password: 'admin123' });
      expect(result.tokenType).toBe('Bearer');
    });

    it('debería ignorar espacios en el email y la contraseña', () => {
      const result = service.login({
        email: '  admin@playlearn.app  ',
        password: '  admin123  ',
      });

      expect(result.role).toBe('admin');
    });
  });
});
