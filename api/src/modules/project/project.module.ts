import { Global,Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { ProjectRepository } from "./project.repository";


@Global()

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}