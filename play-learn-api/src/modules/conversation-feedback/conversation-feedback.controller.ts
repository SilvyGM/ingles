import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { CreateConversationFeedbackDto } from './dto/create-conversation-feedback.dto';
import { UpdateConversationFeedbackDto } from './dto/update-conversation-feedback.dto';
import { ConversationFeedbackService } from './conversation-feedback.service';

@ApiTags('conversation-feedback')
@Roles('admin')
@Controller('conversation-feedback')
export class ConversationFeedbackController {
  constructor(
    private readonly conversationFeedbackService: ConversationFeedbackService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear feedback de conversacion' })
  create(@Body() createConversationFeedbackDto: CreateConversationFeedbackDto) {
    return this.conversationFeedbackService.create(
      createConversationFeedbackDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar feedback de conversacion' })
  findAll() {
    return this.conversationFeedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener feedback por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationFeedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar feedback de conversacion' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateConversationFeedbackDto: UpdateConversationFeedbackDto,
  ) {
    return this.conversationFeedbackService.update(
      id,
      updateConversationFeedbackDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar feedback de conversacion' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationFeedbackService.remove(id);
  }
}
