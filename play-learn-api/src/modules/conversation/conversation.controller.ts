import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/decorators/public.decorator';
import { AnalyzeTurnDto } from './dto/analyze-turn.dto';
import { ConversationService } from './conversation.service';

@ApiTags('conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Public()
  @Post('analyze-turn')
  @ApiOperation({ summary: 'Analizar turno de conversacion con IA y guardar feedback' })
  analyzeTurn(@Body() analyzeTurnDto: AnalyzeTurnDto) {
    return this.conversationService.analyzeTurn(analyzeTurnDto);
  }
}
