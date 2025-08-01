import { Module } from '@nestjs/common';
import { WorkScheduleDayService } from './work-schedule-day.service';
import { WorkScheduleDayController } from './work-schedule-day.controller';

@Module({
  controllers: [WorkScheduleDayController],
  providers: [WorkScheduleDayService],
  exports: [WorkScheduleDayService],
})
export class WorkScheduleDayModule {}
