import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../dto/create-task.dto';

export class Task {
  @ApiProperty({ description: 'Task ID' })
  id: string;

  @ApiProperty({ description: 'Task title' })
  title: string;

  @ApiProperty({ description: 'Task description', required: false })
  description?: string;

  @ApiProperty({ enum: TaskStatus, description: 'Task status' })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, description: 'Task priority' })
  priority: TaskPriority;

  @ApiProperty({ description: 'Estimated hours to complete', required: false })
  estimatedHours?: number;

  @ApiProperty({ description: 'Actual hours worked', required: false })
  actualHours?: number;

  @ApiProperty({ description: 'Project ID' })
  projectId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}