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
import { CreateSkillProgressDto } from './dto/create-skill-progress.dto';
import { UpdateSkillProgressDto } from './dto/update-skill-progress.dto';
import { SkillProgressService } from './skill-progress.service';

@ApiTags('skill-progress')
@Roles('admin')
@Controller('skill-progress')
export class SkillProgressController {
  constructor(private readonly skillProgressService: SkillProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de progreso' })
  create(@Body() createSkillProgressDto: CreateSkillProgressDto) {
    return this.skillProgressService.create(createSkillProgressDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar progreso por habilidad' })
  findAll() {
    return this.skillProgressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener progreso por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillProgressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar progreso por habilidad' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSkillProgressDto: UpdateSkillProgressDto,
  ) {
    return this.skillProgressService.update(id, updateSkillProgressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar progreso por habilidad' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillProgressService.remove(id);
  }
}
