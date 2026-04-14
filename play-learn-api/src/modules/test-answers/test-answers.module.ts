import { Module } from '@nestjs/common';
import { TestAnswersController } from './test-answers.controller';
import { TestAnswersService } from './test-answers.service';

@Module({
  controllers: [TestAnswersController],
  providers: [TestAnswersService],
})
export class TestAnswersModule {}
