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
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

@ApiTags('skills')
@Roles('admin')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear habilidad' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar habilidades' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener habilidad por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar habilidad' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar habilidad' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillsService.remove(id);
  }
}
