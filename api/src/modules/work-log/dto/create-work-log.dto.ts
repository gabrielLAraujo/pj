import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkLogDto {
  @ApiProperty({ description: 'Date of work', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Start time of work', example: '2024-01-15T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'End time of work', example: '2024-01-15T17:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ description: 'Hours worked', example: 8.0 })
  @IsNumber()
  @Min(0.1)
  hoursWorked: number;

  @ApiProperty({ description: 'Description of work done', example: 'Implemented user authentication module' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Task ID if work is related to a specific task', required: false })
  @IsString()
  @IsOptional()
  taskId?: string;

  @ApiProperty({ description: 'Project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}