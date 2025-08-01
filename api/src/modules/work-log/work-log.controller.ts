import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { WorkLogService } from './work-log.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { WorkLog } from './entities/work-log.entity';

@ApiTags('work-logs')
@Controller('work-logs')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work log entry' })
  @ApiResponse({ status: 201, description: 'Work log created successfully', type: WorkLog })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Project or task not found' })
  create(@Body() createWorkLogDto: CreateWorkLogDto): Promise<WorkLog> {
    return this.workLogService.create(createWorkLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work logs for a user' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'Work logs retrieved successfully', type: [WorkLog] })
  findAll(
    @Query('userId') userId: string,
    @Query('projectId') projectId?: string,
  ): Promise<WorkLog[]> {
    return this.workLogService.findAll(userId, projectId);
  }

  @Get('project/:projectId/summary')
  @ApiOperation({ summary: 'Get project work summary' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', required: false })
  @ApiResponse({ status: 200, description: 'Project summary retrieved successfully' })
  getProjectSummary(
    @Param('projectId') projectId: string,
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.workLogService.getProjectSummary(projectId, userId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific work log by ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Work log retrieved successfully', type: WorkLog })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<WorkLog> {
    return this.workLogService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a work log' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Work log updated successfully', type: WorkLog })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateWorkLogDto: UpdateWorkLogDto,
  ): Promise<WorkLog> {
    return this.workLogService.update(id, userId, updateWorkLogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work log' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Work log deleted successfully' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.workLogService.remove(id, userId);
  }

  @Get('reports/monthly')
  @ApiOperation({ summary: 'Get monthly work log report' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'year', description: 'Year (YYYY)', required: true })
  @ApiQuery({ name: 'month', description: 'Month (1-12)', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'Monthly report retrieved successfully' })
  getMonthlyReport(
    @Query('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.workLogService.getMonthlyReport(userId, parseInt(year), parseInt(month), projectId);
  }

  @Get('reports/export/excel')
  @ApiOperation({ summary: 'Export monthly work logs to Excel' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'year', description: 'Year (YYYY)', required: true })
  @ApiQuery({ name: 'month', description: 'Month (1-12)', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'Excel file generated successfully' })
  async exportToExcel(
    @Query('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('projectId') projectId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.workLogService.exportToExcel(userId, parseInt(year), parseInt(month), projectId);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=worklogs-${year}-${month.padStart(2, '0')}.xlsx`);
    res.send(buffer);
  }

  @Get('reports/export/pdf')
  @ApiOperation({ summary: 'Export monthly work logs to PDF' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'year', description: 'Year (YYYY)', required: true })
  @ApiQuery({ name: 'month', description: 'Month (1-12)', required: true })
  @ApiQuery({ name: 'projectId', description: 'Project ID', required: false })
  @ApiResponse({ status: 200, description: 'PDF file generated successfully' })
  async exportToPdf(
    @Query('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('projectId') projectId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.workLogService.exportToPdf(userId, parseInt(year), parseInt(month), projectId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=worklogs-${year}-${month.padStart(2, '0')}.pdf`);
    res.send(buffer);
  }
}