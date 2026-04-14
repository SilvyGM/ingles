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
import { Public } from '../../common/auth/decorators/public.decorator';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { CreateConversationSessionDto } from './dto/create-conversation-session.dto';
import { UpdateConversationSessionDto } from './dto/update-conversation-session.dto';
import { ConversationSessionsService } from './conversation-sessions.service';

@ApiTags('conversation-sessions')
@Roles('admin')
@Controller('conversation-sessions')
export class ConversationSessionsController {
  constructor(
    private readonly conversationSessionsService: ConversationSessionsService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear sesion de conversacion' })
  create(@Body() createConversationSessionDto: CreateConversationSessionDto) {
    return this.conversationSessionsService.create(
      createConversationSessionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar sesiones de conversacion' })
  findAll() {
    return this.conversationSessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sesion de conversacion por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationSessionsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar sesion de conversacion' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateConversationSessionDto: UpdateConversationSessionDto,
  ) {
    return this.conversationSessionsService.update(
      id,
      updateConversationSessionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar sesion de conversacion' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationSessionsService.remove(id);
  }
}
