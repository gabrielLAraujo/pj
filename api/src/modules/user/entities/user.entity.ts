export class User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  provider?: string;
  providerId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, email: string, password: string | null, provider?: string, providerId?: string, avatar?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.provider = provider;
    this.providerId = providerId;
    this.avatar = avatar;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}