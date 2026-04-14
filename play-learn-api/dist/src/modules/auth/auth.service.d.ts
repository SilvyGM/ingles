import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(loginDto: LoginDto): {
        accessToken: string;
        role: "admin" | "learner";
        email: string;
        tokenType: string;
    };
    private resolveRole;
}
