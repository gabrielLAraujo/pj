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
import { WorkScheduleDayService } from './work-schedule-day.service';
import { CreateWorkScheduleDayDto } from './dto/create-work-schedule-day.dto';
import { UpdateWorkScheduleDayDto } from './dto/update-work-schedule-day.dto';
import { WorkScheduleDay } from './entities/work-schedule-day.entity';

@ApiTags('Work Schedule Day')
@Controller('work-schedule-day')
export class WorkScheduleDayController {
  constructor(
    private readonly workScheduleDayService: WorkScheduleDayService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo dia da agenda' })
  @ApiResponse({
    status: 201,
    description: 'Dia da semana criado com sucesso',
    type: WorkScheduleDay,
  })
  create(@Body() createWorkScheduleDayDto: CreateWorkScheduleDayDto) {
    return this.workScheduleDayService.create(createWorkScheduleDayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os dias da agenda' })
  @ApiResponse({
    status: 200,
    description: 'Lista de dias da semana',
    type: [WorkScheduleDay],
  })
  findAll() {
    return this.workScheduleDayService.findAll();
  }

  @Get('work-schedule/:workScheduleId')
  @ApiOperation({ summary: 'Buscar dias por agenda' })
  @ApiParam({ name: 'workScheduleId', description: 'ID da agenda' })
  @ApiResponse({
    status: 200,
    description: 'Dias da semana da agenda',
    type: [WorkScheduleDay],
  })
  findByWorkScheduleId(@Param('workScheduleId') workScheduleId: string) {
    return this.workScheduleDayService.findByWorkScheduleId(workScheduleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar dia por ID' })
  @ApiParam({ name: 'id', description: 'ID do dia' })
  @ApiResponse({
    status: 200,
    description: 'Dia encontrado',
    type: WorkScheduleDay,
  })
  findOne(@Param('id') id: string) {
    return this.workScheduleDayService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dia' })
  @ApiParam({ name: 'id', description: 'ID do dia' })
  @ApiResponse({
    status: 200,
    description: 'Dia da semana atualizado',
    type: WorkScheduleDay,
  })
  update(
    @Param('id') id: string,
    @Body() updateWorkScheduleDayDto: UpdateWorkScheduleDayDto,
  ) {
    return this.workScheduleDayService.update(id, updateWorkScheduleDayDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover dia' })
  @ApiParam({ name: 'id', description: 'ID do dia' })
  @ApiResponse({ status: 200, description: 'Dia removido' })
  remove(@Param('id') id: string) {
    return this.workScheduleDayService.remove(id);
  }
}
