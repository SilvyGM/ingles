"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const jwt_auth_guard_1 = require("./common/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/auth/guards/roles.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const conversation_module_1 = require("./modules/conversation/conversation.module");
const conversation_feedback_module_1 = require("./modules/conversation-feedback/conversation-feedback.module");
const conversation_sessions_module_1 = require("./modules/conversation-sessions/conversation-sessions.module");
const generated_tests_module_1 = require("./modules/generated-tests/generated-tests.module");
const questions_module_1 = require("./modules/questions/questions.module");
const skill_progress_module_1 = require("./modules/skill-progress/skill-progress.module");
const skills_module_1 = require("./modules/skills/skills.module");
const test_answers_module_1 = require("./modules/test-answers/test-answers.module");
const topics_module_1 = require("./modules/topics/topics.module");
const users_module_1 = require("./modules/users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            topics_module_1.TopicsModule,
            skills_module_1.SkillsModule,
            conversation_module_1.ConversationModule,
            conversation_sessions_module_1.ConversationSessionsModule,
            conversation_feedback_module_1.ConversationFeedbackModule,
            questions_module_1.QuestionsModule,
            generated_tests_module_1.GeneratedTestsModule,
            test_answers_module_1.TestAnswersModule,
            skill_progress_module_1.SkillProgressModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map