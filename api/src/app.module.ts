import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkScheduleModule } from './modules/work-schedule/work-schedule.module';
import { WorkScheduleDayModule } from './modules/work-schedule-day/work-schedule-day.module';
import { ForecastModule } from './modules/forecast/forecast.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { WorkLogModule } from './modules/work-log/work-log.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectModule,
    WorkScheduleModule,
    WorkScheduleDayModule,
    WorkLogModule,
    TaskModule,
    ForecastModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
