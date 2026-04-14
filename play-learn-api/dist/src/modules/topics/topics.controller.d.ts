import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    create(createTopicDto: CreateTopicDto): import("@prisma/client").Prisma.Prisma__TopicClient<{
        id: string;
        createdAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        difficultyLevel: string;
        slug: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        difficultyLevel: string;
        slug: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        difficultyLevel: string;
        slug: string;
    }>;
    update(id: string, updateTopicDto: UpdateTopicDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        difficultyLevel: string;
        slug: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string;
        isActive: boolean;
        difficultyLevel: string;
        slug: string;
    }>;
}
