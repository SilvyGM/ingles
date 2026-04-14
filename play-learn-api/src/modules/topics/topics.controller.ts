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
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';

@ApiTags('topics')
@Roles('admin')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear tema de conversacion' })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar temas' })
  findAll() {
    return this.topicsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener tema por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tema' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tema' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.topicsService.remove(id);
  }
}
