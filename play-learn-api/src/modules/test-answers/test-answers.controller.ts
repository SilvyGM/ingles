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
import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';
import { TestAnswersService } from './test-answers.service';

@ApiTags('test-answers')
@Roles('admin')
@Controller('test-answers')
export class TestAnswersController {
  constructor(private readonly testAnswersService: TestAnswersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear respuesta de test' })
  create(@Body() createTestAnswerDto: CreateTestAnswerDto) {
    return this.testAnswersService.create(createTestAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar respuestas de test' })
  findAll() {
    return this.testAnswersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener respuesta de test por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.testAnswersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar respuesta de test' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTestAnswerDto: UpdateTestAnswerDto,
  ) {
    return this.testAnswersService.update(id, updateTestAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar respuesta de test' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.testAnswersService.remove(id);
  }
}
