import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WorkScheduleService } from './work-schedule.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { WorkSchedule } from './entities/work-schedule.entity';

@ApiTags('Work Schedule')
@Controller('work-schedule')
export class WorkScheduleController {
  constructor(private readonly workScheduleService: WorkScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova agenda de trabalho' })
  @ApiResponse({
    status: 201,
    description: 'Agenda criada com sucesso',
    type: WorkSchedule,
  })
  create(@Body() createWorkScheduleDto: CreateWorkScheduleDto) {
    return this.workScheduleService.create(createWorkScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as agendas de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendas',
    type: [WorkSchedule],
  })
  findAll() {
    return this.workScheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agenda por ID' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiResponse({
    status: 200,
    description: 'Agenda encontrada',
    type: WorkSchedule,
  })
  findOne(@Param('id') id: string) {
    return this.workScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agenda' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiResponse({
    status: 200,
    description: 'Agenda atualizada',
    type: WorkSchedule,
  })
  update(
    @Param('id') id: string,
    @Body() updateWorkScheduleDto: UpdateWorkScheduleDto,
  ) {
    return this.workScheduleService.update(id, updateWorkScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agenda' })
  @ApiParam({ name: 'id', description: 'ID da agenda' })
  @ApiResponse({ status: 200, description: 'Agenda removida' })
  remove(@Param('id') id: string) {
    return this.workScheduleService.remove(id);
  }
}
