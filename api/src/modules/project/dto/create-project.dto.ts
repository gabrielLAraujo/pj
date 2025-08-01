import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'E-commerce Website' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Project description', required: false, example: 'Building a modern e-commerce platform' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Hourly rate for this project', example: 50.0 })
  @IsNumber()
  @Min(0.01)
  hourlyRate: number;

  @ApiProperty({ description: 'Currency code', default: 'USD', example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ enum: ProjectStatus, description: 'Project status', default: ProjectStatus.ACTIVE })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus = ProjectStatus.ACTIVE;

  @ApiProperty({ description: 'Project start date', required: false, example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'Project end date', required: false, example: '2024-06-15' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}