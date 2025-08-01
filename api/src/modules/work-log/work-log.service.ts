import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { WorkLog } from './entities/work-log.entity';
import * as ExcelJS from 'exceljs';
import * as puppeteer from 'puppeteer';

@Injectable()
export class WorkLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkLogDto: CreateWorkLogDto): Promise<WorkLog> {
    const { date, startTime, endTime, hoursWorked, description, taskId, projectId, userId } = createWorkLogDto;

    // Validate that the project exists and belongs to the user
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found or does not belong to user');
    }

    // Validate task if provided
    if (taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: taskId, projectId, userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found or does not belong to project');
      }
    }

    // Validate time logic
    if (endTime && new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }

    const workLog = await this.prisma.workLog.create({
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        hoursWorked,
        description,
        taskId,
        projectId,
        userId,
      },
      include: {
        project: true,
        task: true,
      },
    });

    return this.mapToEntity(workLog);
  }

  async findAll(userId: string, projectId?: string): Promise<WorkLog[]> {
    const workLogs = await this.prisma.workLog.findMany({
      where: {
        userId,
        ...(projectId && { projectId }),
      },
      include: {
        project: true,
        task: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return workLogs.map(this.mapToEntity);
  }

  async findOne(id: string, userId: string): Promise<WorkLog> {
    const workLog = await this.prisma.workLog.findFirst({
      where: { id, userId },
      include: {
        project: true,
        task: true,
      },
    });

    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    return this.mapToEntity(workLog);
  }

  async update(id: string, userId: string, updateWorkLogDto: UpdateWorkLogDto): Promise<WorkLog> {
    const existingWorkLog = await this.prisma.workLog.findFirst({
      where: { id, userId },
    });

    if (!existingWorkLog) {
      throw new NotFoundException('Work log not found');
    }

    const updateData: any = {};

    if (updateWorkLogDto.date) {
      updateData.date = new Date(updateWorkLogDto.date);
    }

    if (updateWorkLogDto.startTime) {
      updateData.startTime = new Date(updateWorkLogDto.startTime);
    }

    if (updateWorkLogDto.endTime) {
      updateData.endTime = new Date(updateWorkLogDto.endTime);
    }

    if (updateWorkLogDto.hoursWorked !== undefined) {
      updateData.hoursWorked = updateWorkLogDto.hoursWorked;
    }

    if (updateWorkLogDto.description) {
      updateData.description = updateWorkLogDto.description;
    }

    if (updateWorkLogDto.taskId !== undefined) {
      updateData.taskId = updateWorkLogDto.taskId;
    }

    const updatedWorkLog = await this.prisma.workLog.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        task: true,
      },
    });

    return this.mapToEntity(updatedWorkLog);
  }

  async remove(id: string, userId: string): Promise<void> {
    const workLog = await this.prisma.workLog.findFirst({
      where: { id, userId },
    });

    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }

    await this.prisma.workLog.delete({
      where: { id },
    });
  }

  async getProjectSummary(projectId: string, userId: string, startDate?: string, endDate?: string) {
    const whereClause: any = {
      projectId,
      userId,
    };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    const workLogs = await this.prisma.workLog.findMany({
      where: whereClause,
      include: {
        project: true,
      },
    });

    const totalHours = workLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const project = workLogs[0]?.project;
    const totalCost = project ? totalHours * project.hourlyRate : 0;

    return {
      projectId,
      projectName: project?.name,
      totalHours,
      totalCost,
      currency: project?.currency || 'USD',
      workLogCount: workLogs.length,
      period: {
        startDate,
        endDate,
      },
    };
  }

  async getMonthlyReport(userId: string, year: number, month: number, projectId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const whereClause: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const workLogs = await this.prisma.workLog.findMany({
      where: whereClause,
      include: {
        project: true,
        task: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by project
    const projectSummaries = new Map();
    let totalHours = 0;
    let totalCost = 0;

    workLogs.forEach(log => {
      const projectId = log.projectId;
      const projectName = log.project?.name || 'Unknown Project';
      const hourlyRate = log.project?.hourlyRate || 0;
      const logCost = log.hoursWorked * hourlyRate;

      if (!projectSummaries.has(projectId)) {
        projectSummaries.set(projectId, {
          projectId,
          projectName,
          hourlyRate,
          currency: log.project?.currency || 'USD',
          totalHours: 0,
          totalCost: 0,
          workLogs: [],
        });
      }

      const summary = projectSummaries.get(projectId);
      summary.totalHours += log.hoursWorked;
      summary.totalCost += logCost;
      summary.workLogs.push(this.mapToEntity(log));

      totalHours += log.hoursWorked;
      totalCost += logCost;
    });

    return {
      period: {
        year,
        month,
        startDate,
        endDate,
      },
      summary: {
        totalHours,
        totalCost,
        totalWorkLogs: workLogs.length,
        totalProjects: projectSummaries.size,
      },
      projects: Array.from(projectSummaries.values()),
    };
  }

  async exportToExcel(userId: string, year: number, month: number, projectId?: string): Promise<Buffer> {
    const report = await this.getMonthlyReport(userId, year, month, projectId);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Work Logs - ${year}/${month.toString().padStart(2, '0')}`);

    // Header
    worksheet.columns = [
      { header: 'Data', key: 'date', width: 12 },
      { header: 'Projeto', key: 'project', width: 20 },
      { header: 'Tarefa', key: 'task', width: 20 },
      { header: 'Descrição', key: 'description', width: 40 },
      { header: 'Início', key: 'startTime', width: 12 },
      { header: 'Fim', key: 'endTime', width: 12 },
      { header: 'Horas', key: 'hours', width: 10 },
      { header: 'Valor/Hora', key: 'hourlyRate', width: 12 },
      { header: 'Total', key: 'total', width: 12 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data
    report.projects.forEach(project => {
      project.workLogs.forEach(log => {
        worksheet.addRow({
          date: new Date(log.date).toLocaleDateString('pt-BR'),
          project: project.projectName,
          task: log.taskId || 'N/A',
          description: log.description,
          startTime: new Date(log.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          endTime: log.endTime ? new Date(log.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          hours: log.hoursWorked,
          hourlyRate: project.hourlyRate,
          total: log.hoursWorked * project.hourlyRate,
        });
      });
    });

    // Add summary
    worksheet.addRow({});
    worksheet.addRow({
      date: 'RESUMO',
      project: '',
      task: '',
      description: '',
      startTime: '',
      endTime: '',
      hours: report.summary.totalHours,
      hourlyRate: '',
      total: report.summary.totalCost,
    });

    const summaryRow = worksheet.lastRow;
    if (summaryRow) {
      summaryRow.font = { bold: true };
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCC00' },
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportToPdf(userId: string, year: number, month: number, projectId?: string): Promise<Buffer> {
    const report = await this.getMonthlyReport(userId, year, month, projectId);
    
    const html = this.generatePdfHtml(report, year, month);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });
    
    await browser.close();
    
    return Buffer.from(pdf);
  }

  private generatePdfHtml(report: any, year: number, month: number): string {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Work Logs - ${monthNames[month - 1]} ${year}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background-color: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .project-section { margin-bottom: 30px; }
          .project-title { background-color: #e0e0e0; padding: 10px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .total-row { background-color: #ffffcc; font-weight: bold; }
          .currency { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Work Logs</h1>
          <h2>${monthNames[month - 1]} ${year}</h2>
        </div>
        
        <div class="summary">
          <h3>Resumo Geral</h3>
          <p><strong>Total de Horas:</strong> ${report.summary.totalHours.toFixed(2)}h</p>
          <p><strong>Total de Projetos:</strong> ${report.summary.totalProjects}</p>
          <p><strong>Total de Registros:</strong> ${report.summary.totalWorkLogs}</p>
          <p><strong>Valor Total:</strong> R$ ${report.summary.totalCost.toFixed(2)}</p>
        </div>
    `;

    report.projects.forEach(project => {
      html += `
        <div class="project-section">
          <div class="project-title">
            ${project.projectName} - ${project.totalHours.toFixed(2)}h - R$ ${project.totalCost.toFixed(2)}
          </div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Horas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
      `;

      project.workLogs.forEach(log => {
        html += `
          <tr>
            <td>${new Date(log.date).toLocaleDateString('pt-BR')}</td>
            <td>${log.description}</td>
            <td>${new Date(log.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${log.endTime ? new Date(log.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
            <td>${log.hoursWorked.toFixed(2)}h</td>
            <td class="currency">R$ ${(log.hoursWorked * project.hourlyRate).toFixed(2)}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    });

    html += `
      </body>
      </html>
    `;

    return html;
  }

  private mapToEntity(workLog: any): WorkLog {
    return {
      id: workLog.id,
      date: workLog.date,
      startTime: workLog.startTime,
      endTime: workLog.endTime,
      hoursWorked: workLog.hoursWorked,
      description: workLog.description,
      taskId: workLog.taskId,
      projectId: workLog.projectId,
      userId: workLog.userId,
      createdAt: workLog.createdAt,
      updatedAt: workLog.updatedAt,
      calculatedCost: workLog.project ? workLog.hoursWorked * workLog.project.hourlyRate : undefined,
    };
  }
}