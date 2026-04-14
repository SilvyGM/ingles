import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): {
        accessToken: string;
        role: "admin" | "learner";
        email: string;
        tokenType: string;
    };
}
