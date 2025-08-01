export class UpdateProjectDto {
  id: string;
  name?: string;
  description?: string;
  userId?: string;

  constructor(id: string, name?: string, description?: string, userId?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
  }
}