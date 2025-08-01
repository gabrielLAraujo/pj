import { ApiProperty } from '@nestjs/swagger';

export class WorkLog {
  @ApiProperty({ description: 'Work log ID' })
  id: string;

  @ApiProperty({ description: 'Date of work' })
  date: Date;

  @ApiProperty({ description: 'Start time of work' })
  startTime: Date;

  @ApiProperty({ description: 'End time of work', required: false })
  endTime?: Date;

  @ApiProperty({ description: 'Hours worked' })
  hoursWorked: number;

  @ApiProperty({ description: 'Description of work done' })
  description: string;

  @ApiProperty({ description: 'Task ID if work is related to a specific task', required: false })
  taskId?: string;

  @ApiProperty({ description: 'Project ID' })
  projectId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Calculated cost based on project hourly rate', required: false })
  calculatedCost?: number;
}