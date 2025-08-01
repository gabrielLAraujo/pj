import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, TaskStatus, TaskPriority } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, priority, estimatedHours, actualHours, projectId, userId } = createTaskDto;

    // Validate that the project exists and belongs to the user
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found or does not belong to user');
    }

    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        status: status || TaskStatus.TODO,
        priority: priority || TaskPriority.MEDIUM,
        estimatedHours,
        actualHours,
        projectId,
        userId,
      },
    });

    return this.mapToEntity(task);
  }

  async findAll(userId: string, projectId?: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        ...(projectId && { projectId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map(this.mapToEntity);
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.mapToEntity(task);
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return this.mapToEntity(updatedTask);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async getTasksByStatus(userId: string, status: TaskStatus, projectId?: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        status,
        ...(projectId && { projectId }),
      },
      orderBy: {
        priority: 'desc',
      },
    });

    return tasks.map(this.mapToEntity);
  }

  async updateActualHours(id: string, userId: string, actualHours: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { actualHours },
    });

    return this.mapToEntity(updatedTask);
  }

  private mapToEntity(task: any): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      projectId: task.projectId,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}