import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/auth/guards/roles.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { ConversationFeedbackModule } from './modules/conversation-feedback/conversation-feedback.module';
import { ConversationSessionsModule } from './modules/conversation-sessions/conversation-sessions.module';
import { GeneratedTestsModule } from './modules/generated-tests/generated-tests.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { SkillProgressModule } from './modules/skill-progress/skill-progress.module';
import { SkillsModule } from './modules/skills/skills.module';
import { TestAnswersModule } from './modules/test-answers/test-answers.module';
import { TopicsModule } from './modules/topics/topics.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    TopicsModule,
    SkillsModule,
    ConversationModule,
    ConversationSessionsModule,
    ConversationFeedbackModule,
    QuestionsModule,
    GeneratedTestsModule,
    TestAnswersModule,
    SkillProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
