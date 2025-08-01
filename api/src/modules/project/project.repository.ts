import { PrismaService } from "../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {
    console.log('ProjectRepository → prisma =', prisma);
  }

  async create(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({ data });
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findFirst(where: Prisma.ProjectWhereInput) {
    return this.prisma.project.findFirst({ where });
  }
}