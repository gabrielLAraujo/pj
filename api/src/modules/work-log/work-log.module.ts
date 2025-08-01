import { Module } from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { WorkLogController } from './work-log.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [WorkLogController],
  providers: [WorkLogService, PrismaService],
  exports: [WorkLogService],
})
export class WorkLogModule {}