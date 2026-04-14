import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        targetLanguage: createUserDto.targetLanguage,
        currentLevel: createUserDto.currentLevel as LanguageLevel,
        xpTotal: createUserDto.xpTotal ?? 0,
        currentStreak: createUserDto.currentStreak ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        fullName: updateUserDto.fullName,
        targetLanguage: updateUserDto.targetLanguage,
        currentLevel: updateUserDto.currentLevel as LanguageLevel | undefined,
        xpTotal: updateUserDto.xpTotal,
        currentStreak: updateUserDto.currentStreak,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
