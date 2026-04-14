import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        targetLanguage: string;
        currentLevel: string;
        xpTotal: number;
        currentStreak: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        targetLanguage: string;
        currentLevel: string;
        xpTotal: number;
        currentStreak: number;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        targetLanguage: string;
        currentLevel: string;
        xpTotal: number;
        currentStreak: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        targetLanguage: string;
        currentLevel: string;
        xpTotal: number;
        currentStreak: number;
    }>;
    remove(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        targetLanguage: string;
        currentLevel: string;
        xpTotal: number;
        currentStreak: number;
    }>;
}
