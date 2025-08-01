import { Injectable } from "@nestjs/common";
import { ProjectRepository } from "./project.repository"; // Assuming you have a repository for project data

@Injectable()
export class ProjectService {
    // Define your service methods here
    // For example, you might have methods to create, update, delete, or retrieve projects
    constructor(private readonly projectRepository: ProjectRepository) {}
    async createProject(projectData: any): Promise<any> {
        // Logic to create a project
        const createdProject = await this.projectRepository.create(projectData);
        
        return createdProject;
    };
    
    
    async getProjects(): Promise<any[]> {
        return await this.projectRepository.findAll();
    }
    
    async getProjectById(id: string): Promise<any> {
        return await this.projectRepository.findFirst({ id });
    }
}