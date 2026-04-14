import { Module } from '@nestjs/common';
import { GeneratedTestsController } from './generated-tests.controller';
import { GeneratedTestsService } from './generated-tests.service';

@Module({
  controllers: [GeneratedTestsController],
  providers: [GeneratedTestsService],
})
export class GeneratedTestsModule {}
