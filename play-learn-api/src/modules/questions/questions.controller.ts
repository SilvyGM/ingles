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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Roles('admin')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear pregunta' })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar preguntas' })
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pregunta por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pregunta' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pregunta' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.questionsService.remove(id);
  }
}
