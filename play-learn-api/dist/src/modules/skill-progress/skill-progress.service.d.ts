import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillProgressDto } from './dto/create-skill-progress.dto';
import { UpdateSkillProgressDto } from './dto/update-skill-progress.dto';
export declare class SkillProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSkillProgressDto: CreateSkillProgressDto): import("@prisma/client").Prisma.Prisma__SkillProgressClient<{
        id: string;
        userId: string;
        topicId: string | null;
        skillId: string;
        masteryLevel: import("@prisma/client-runtime-utils").Decimal;
        lastScore: import("@prisma/client-runtime-utils").Decimal | null;
        lastPracticedAt: Date | null;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        topicId: string | null;
        skillId: string;
        masteryLevel: import("@prisma/client-runtime-utils").Decimal;
        lastScore: import("@prisma/client-runtime-utils").Decimal | null;
        lastPracticedAt: Date | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        topicId: string | null;
        skillId: string;
        masteryLevel: import("@prisma/client-runtime-utils").Decimal;
        lastScore: import("@prisma/client-runtime-utils").Decimal | null;
        lastPracticedAt: Date | null;
        updatedAt: Date;
    }>;
    update(id: string, updateSkillProgressDto: UpdateSkillProgressDto): Promise<{
        id: string;
        userId: string;
        topicId: string | null;
        skillId: string;
        masteryLevel: import("@prisma/client-runtime-utils").Decimal;
        lastScore: import("@prisma/client-runtime-utils").Decimal | null;
        lastPracticedAt: Date | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        topicId: string | null;
        skillId: string;
        masteryLevel: import("@prisma/client-runtime-utils").Decimal;
        lastScore: import("@prisma/client-runtime-utils").Decimal | null;
        lastPracticedAt: Date | null;
        updatedAt: Date;
    }>;
}
