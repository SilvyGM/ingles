import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSkillDto: CreateSkillDto): import("@prisma/client").Prisma.Prisma__SkillClient<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        category: string;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        category: string;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        category: string;
        isActive: boolean;
    }>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        category: string;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        category: string;
        isActive: boolean;
    }>;
}
