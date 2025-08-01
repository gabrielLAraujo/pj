import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ForecastService } from './forecast.service';
import { GenerateForecastDto } from './dto/generate-forecast.dto';
import { Forecast } from './entities/forecast.entity';

@ApiTags('Forecast')
@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Gerar previsão mensal de trabalho' })
  @ApiResponse({
    status: 201,
    description: 'Previsão gerada com sucesso',
    type: Forecast,
  })
  generateForecast(@Body() generateForecastDto: GenerateForecastDto) {
    return this.forecastService.generateForecast(generateForecastDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as previsões' })
  @ApiResponse({
    status: 200,
    description: 'Lista de previsões',
    type: [Forecast],
  })
  findAll() {
    return this.forecastService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar previsão por ID' })
  @ApiParam({ name: 'id', description: 'ID da previsão' })
  @ApiResponse({
    status: 200,
    description: 'Previsão encontrada',
    type: Forecast,
  })
  findOne(@Param('id') id: string) {
    return this.forecastService.findOne(id);
  }

  @Get('work-schedule/:workScheduleId')
  @ApiOperation({ summary: 'Buscar previsões por agenda de trabalho' })
  @ApiParam({ name: 'workScheduleId', description: 'ID da agenda de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Previsões da agenda',
    type: [Forecast],
  })
  findByWorkSchedule(@Param('workScheduleId') workScheduleId: string) {
    return this.forecastService.findByWorkSchedule(workScheduleId);
  }
}
