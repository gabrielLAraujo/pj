import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a user' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  findAll(
    @Query('userId') userId: string,
    @Query('projectId') projectId?: string,
  ): Promise<Task[]> {
    return this.taskService.findAll(userId, projectId);
  }

  @Get('by-status/:status')
  @ApiOperation({ summary: 'Get tasks by status' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  getTasksByStatus(
    @Param('status') status: TaskStatus,
    @Query('userId') userId: string,
    @Query('projectId') projectId?: string,
  ): Promise<Task[]> {
    return this.taskService.getTasksByStatus(userId, status, projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<Task> {
    return this.taskService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, userId, updateTaskDto);
  }

  @Patch(':id/actual-hours')
  @ApiOperation({ summary: 'Update actual hours for a task' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Task actual hours updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateActualHours(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body('actualHours') actualHours: number,
  ): Promise<Task> {
    return this.taskService.updateActualHours(id, userId, actualHours);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.taskService.remove(id, userId);
  }
}