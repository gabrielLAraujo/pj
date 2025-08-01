import { Injectable } from '@nestjs/common';
import { GenerateForecastDto } from './dto/generate-forecast.dto';
import { Forecast, WorkDayForecast } from './entities/forecast.entity';
import { WorkScheduleService } from '../work-schedule/work-schedule.service';
import { WorkScheduleDayService } from '../work-schedule-day/work-schedule-day.service';
import { WorkSchedule } from '../work-schedule/entities/work-schedule.entity';
import { WorkScheduleDay } from '../work-schedule-day/entities/work-schedule-day.entity';

interface WorkDayConfig {
  startTime: string;
  endTime: string;
  workHours: number;
}

@Injectable()
export class ForecastService {
  private forecasts: Forecast[] = [];

  constructor(
    private readonly workScheduleService: WorkScheduleService,
    private readonly workScheduleDayService: WorkScheduleDayService,
  ) {}

  async generateForecast(generateForecastDto: GenerateForecastDto, projectId?: string, hourlyRate?: number): Promise<Forecast> {
    const { workScheduleId, month, year, includeHolidays = false } = generateForecastDto;

    const workSchedule = this.workScheduleService.findOne(workScheduleId);
    if (!workSchedule) {
      throw new Error(`Work schedule with ID ${workScheduleId} not found`);
    }

    const workScheduleDays = this.workScheduleDayService.findByWorkScheduleId(workScheduleId);

    // Use provided hourly rate or default to 65
    const ratePerHour = hourlyRate || 65;

    const workDays = this.generateMonthDays(year, month, workSchedule, workScheduleDays, includeHolidays, ratePerHour);

    // Calculate totals
    const totalWorkDays = workDays.filter(day => day.isWorkDay && !day.isHoliday).length;
    const totalWorkHours = workDays
      .filter(day => day.isWorkDay && !day.isHoliday)
      .reduce((total, day) => total + day.workHours, 0);

    const forecast: Forecast = {
      id: this.generateId(),
      workScheduleId,
      month,
      year,
      totalWorkDays,
      totalWorkHours,
      workDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      monthlyGains: ratePerHour * totalWorkHours,
      projectId,
      hourlyRate: ratePerHour,
    };

    this.forecasts.push(forecast);
    return forecast;
  }

  private generateMonthDays(
    year: number,
    month: number,
    workSchedule: WorkSchedule,
    workScheduleDays: WorkScheduleDay[],
    includeHolidays: boolean,
    hourlyRate: number,
  ): WorkDayForecast[] {
    const days: WorkDayForecast[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    // Mapear dias da semana para as chaves da agenda
    const dayMapping = {
      0: 'sunday',    // Domingo
      1: 'monday',    // Segunda
      2: 'tuesday',   // Terça
      3: 'wednesday', // Quarta
      4: 'thursday',  // Quinta
      5: 'friday',    // Sexta
      6: 'saturday',  // Sábado
    };

    // Feriados brasileiros (exemplo)
    // const holidays = includeHolidays ? this.getBrazilianHolidays(year, month) : [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // Verificar se é feriado
      //   const holiday = holidays.find(h => h.date === dateString);
      //   const isHoliday = !!holiday;
      const isHoliday = false;

      // Verificar se é dia de trabalho na agenda
      const dayKey = dayMapping[dayOfWeek as keyof typeof dayMapping];
      const dayConfig = workSchedule.days[dayKey as keyof typeof workSchedule.days];
      const isWorkDay = dayConfig?.enabled || false;
      const workHours = dayConfig ? this.calculateWorkHours(dayConfig.startTime, dayConfig.endTime) : 0;
      const workDay: WorkDayForecast = {
        date: dateString,
        dayOfWeek,
        dayName: dayNames[dayOfWeek],
        isWorkDay,
        startTime: isWorkDay && dayConfig ? dayConfig.startTime : '',
        endTime: isWorkDay && dayConfig ? dayConfig.endTime : '',
        workHours: workHours,
        isHoliday,
        holidayName: undefined,
        dailyGains: hourlyRate * workHours,
      };

      days.push(workDay);
    }

    return days;
  }

  private calculateWorkHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60 * 60)); // Converter para horas
  }



  findAll(): Forecast[] {
    return this.forecasts;
  }

  findOne(id: string): Forecast | undefined {
    return this.forecasts.find(forecast => forecast.id === id);
  }

  findByWorkSchedule(workScheduleId: string): Forecast[] {
    return this.forecasts.filter(forecast => forecast.workScheduleId === workScheduleId);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}