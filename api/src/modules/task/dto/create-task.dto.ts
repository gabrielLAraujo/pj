import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Implement user authentication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Task description', required: false, example: 'Create login and registration functionality' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, description: 'Task status', default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({ enum: TaskPriority, description: 'Task priority', default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({ description: 'Estimated hours to complete', required: false, example: 8.0 })
  @IsNumber()
  @Min(0.1)
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({ description: 'Actual hours worked', required: false, example: 6.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;

  @ApiProperty({ description: 'Project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}