export class CreateUserDto {
  name: string;
  email: string;
  password: string | null;
  provider?: string;
  providerId?: string;
  avatar?: string;
}