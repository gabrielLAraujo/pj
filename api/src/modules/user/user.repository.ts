import { PrismaService } from "../../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {
      console.log('UserRepository → prisma =', prisma);

  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
  async findFirst(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({ where });
  }
  
}