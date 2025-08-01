#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

class FreelanceDbServer {
  constructor() {
    this.prisma = new PrismaClient();
    this.server = new Server(
      {
        name: 'freelance-db-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'query_projects',
            description: 'Query projects from the database',
            inputSchema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: 'User ID to filter projects',
                },
                status: {
                  type: 'string',
                  description: 'Project status filter',
                },
              },
            },
          },
          {
            name: 'query_work_logs',
            description: 'Query work logs from the database',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'Project ID to filter work logs',
                },
                userId: {
                  type: 'string',
                  description: 'User ID to filter work logs',
                },
                startDate: {
                  type: 'string',
                  description: 'Start date for filtering (YYYY-MM-DD)',
                },
                endDate: {
                  type: 'string',
                  description: 'End date for filtering (YYYY-MM-DD)',
                },
              },
            },
          },
          {
            name: 'query_tasks',
            description: 'Query tasks from the database',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'Project ID to filter tasks',
                },
                status: {
                  type: 'string',
                  description: 'Task status filter',
                },
                userId: {
                  type: 'string',
                  description: 'User ID to filter tasks',
                },
              },
            },
          },
          {
            name: 'get_project_summary',
            description: 'Get comprehensive project summary with work logs and tasks',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'Project ID',
                  required: true,
                },
              },
              required: ['projectId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'query_projects':
            return await this.queryProjects(args);
          case 'query_work_logs':
            return await this.queryWorkLogs(args);
          case 'query_tasks':
            return await this.queryTasks(args);
          case 'get_project_summary':
            return await this.getProjectSummary(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Database query failed: ${error.message}`
        );
      }
    });
  }

  async queryProjects(args) {
    const where = {};
    if (args.userId) where.userId = args.userId;
    if (args.status) where.status = args.status;

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        user: true,
        workLogs: true,
        tasks: true,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(projects, null, 2),
        },
      ],
    };
  }

  async queryWorkLogs(args) {
    const where = {};
    if (args.projectId) where.projectId = args.projectId;
    if (args.userId) where.userId = args.userId;
    if (args.startDate || args.endDate) {
      where.date = {};
      if (args.startDate) where.date.gte = new Date(args.startDate);
      if (args.endDate) where.date.lte = new Date(args.endDate);
    }

    const workLogs = await this.prisma.workLog.findMany({
      where,
      include: {
        project: true,
        user: true,
        task: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workLogs, null, 2),
        },
      ],
    };
  }

  async queryTasks(args) {
    const where = {};
    if (args.projectId) where.projectId = args.projectId;
    if (args.userId) where.userId = args.userId;
    if (args.status) where.status = args.status;

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        project: true,
        user: true,
        workLogs: true,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }

  async getProjectSummary(args) {
    const project = await this.prisma.project.findUnique({
      where: { id: args.projectId },
      include: {
        user: true,
        workLogs: {
          include: {
            task: true,
          },
        },
        tasks: {
          include: {
            workLogs: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const totalHours = project.workLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const totalCost = totalHours * project.hourlyRate;
    const completedTasks = project.tasks.filter(task => task.status === 'COMPLETED').length;
    const totalTasks = project.tasks.length;

    const summary = {
      project,
      summary: {
        totalHours,
        totalCost,
        completedTasks,
        totalTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(summary, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Freelance DB MCP server running on stdio');
  }
}

const server = new FreelanceDbServer();
server.run().catch(console.error);