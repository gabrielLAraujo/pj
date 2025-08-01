import { Injectable } from '@nestjs/common';
import { CreateWorkScheduleDayDto } from './dto/create-work-schedule-day.dto';
import { UpdateWorkScheduleDayDto } from './dto/update-work-schedule-day.dto';
import { WorkScheduleDay } from './entities/work-schedule-day.entity';

@Injectable()
export class WorkScheduleDayService {
  private workScheduleDays: WorkScheduleDay[] = [];

  create(createWorkScheduleDayDto: CreateWorkScheduleDayDto): WorkScheduleDay {
    const workScheduleDay: WorkScheduleDay = {
      id: this.generateId(),
      ...createWorkScheduleDayDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workScheduleDays.push(workScheduleDay);
    return workScheduleDay;
  }

  findAll(): WorkScheduleDay[] {
    return this.workScheduleDays;
  }

  findByWorkScheduleId(workScheduleId: string): WorkScheduleDay[] {
    return this.workScheduleDays.filter(
      (day) => day.workScheduleId === workScheduleId,
    );
  }

  findOne(id: string): WorkScheduleDay | undefined {
    return this.workScheduleDays.find((day) => day.id === id);
  }

  update(
    id: string,
    updateWorkScheduleDayDto: UpdateWorkScheduleDayDto,
  ): WorkScheduleDay | undefined {
    const index = this.workScheduleDays.findIndex((day) => day.id === id);

    if (index === -1) {
      return undefined;
    }

    this.workScheduleDays[index] = {
      ...this.workScheduleDays[index],
      ...updateWorkScheduleDayDto,
      updatedAt: new Date(),
    };

    return this.workScheduleDays[index];
  }

  remove(id: string): boolean {
    const index = this.workScheduleDays.findIndex((day) => day.id === id);

    if (index === -1) {
      return false;
    }

    this.workScheduleDays.splice(index, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
