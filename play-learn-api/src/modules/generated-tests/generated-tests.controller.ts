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
import { CreateGeneratedTestDto } from './dto/create-generated-test.dto';
import { UpdateGeneratedTestDto } from './dto/update-generated-test.dto';
import { GeneratedTestsService } from './generated-tests.service';

@ApiTags('generated-tests')
@Roles('admin')
@Controller('generated-tests')
export class GeneratedTestsController {
  constructor(private readonly generatedTestsService: GeneratedTestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear test generado' })
  create(@Body() createGeneratedTestDto: CreateGeneratedTestDto) {
    return this.generatedTestsService.create(createGeneratedTestDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar tests generados' })
  findAll() {
    return this.generatedTestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener test generado por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.generatedTestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar test generado' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGeneratedTestDto: UpdateGeneratedTestDto,
  ) {
    return this.generatedTestsService.update(id, updateGeneratedTestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar test generado' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.generatedTestsService.remove(id);
  }
}
