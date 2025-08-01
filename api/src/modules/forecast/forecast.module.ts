import { Module } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { ForecastController } from './forecast.controller';
import { WorkScheduleModule } from '../work-schedule/work-schedule.module';
import { WorkScheduleDayModule } from '../work-schedule-day/work-schedule-day.module';

@Module({
  imports: [WorkScheduleModule, WorkScheduleDayModule],
  controllers: [ForecastController],
  providers: [ForecastService],
  exports: [ForecastService],
})
export class ForecastModule {}
