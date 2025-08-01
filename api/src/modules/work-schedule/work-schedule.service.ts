import { Injectable } from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { WorkSchedule } from './entities/work-schedule.entity';

@Injectable()
export class WorkScheduleService {
  private workSchedules: WorkSchedule[] = [];

  create(createWorkScheduleDto: CreateWorkScheduleDto): WorkSchedule {
    const workSchedule: WorkSchedule = {
      id: this.generateId(),
      ...createWorkScheduleDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workSchedules.push(workSchedule);
    return workSchedule;
  }

  findAll(): WorkSchedule[] {
    return this.workSchedules;
  }

  findOne(id: string): WorkSchedule | undefined {
    return this.workSchedules.find((schedule) => schedule.id === id);
  }

  update(
    id: string,
    updateWorkScheduleDto: UpdateWorkScheduleDto,
  ): WorkSchedule | undefined {
    const index = this.workSchedules.findIndex(
      (schedule) => schedule.id === id,
    );

    if (index === -1) {
      return undefined;
    }

    this.workSchedules[index] = {
      ...this.workSchedules[index],
      ...updateWorkScheduleDto,
      updatedAt: new Date(),
    };

    return this.workSchedules[index];
  }

  remove(id: string): boolean {
    const index = this.workSchedules.findIndex(
      (schedule) => schedule.id === id,
    );

    if (index === -1) {
      return false;
    }

    this.workSchedules.splice(index, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
