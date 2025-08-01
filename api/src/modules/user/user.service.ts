import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {
          console.log('UserService → userRepository =', userRepository);
    }
    private users: User[] = [];
    generateId(): string {
        return uuidv4();
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, provider, providerId, avatar } = createUserDto;
         try {
    console.log('Tentando criar usuário...');
    const result = await this.userRepository.create({
      name: name,
      email: email,
      password: password,
      provider: provider,
      providerId: providerId,
      avatar: avatar,
    });
    console.log('Usuário criado com sucesso:', result);
    return new User(
      result.id,
      result.name,
      result.email,
      result.password,
      result.provider || undefined,
      result.providerId || undefined,
      result.avatar || undefined
    );
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    throw err; // não engole o erro
  }
    }
    findOne(id: string): User {
        const returnedUser = this.users.find((user) => user.id === id);
        if (returnedUser) {
            return returnedUser;
        }else {
            throw new Error('User not found');
        }
    }
    async findByEmail(email: string): Promise<User | null> {
       const user = await this.userRepository.findFirst({ email });
       if (!user) return null;
       
       return new User(
         user.id,
         user.name,
         user.email,
         user.password,
         user.provider || undefined,
         user.providerId || undefined,
         user.avatar || undefined
       );
    }
    
    async findById(id: string): Promise<User | null> {
       const user = await this.userRepository.findFirst({ id });
       if (!user) return null;
       
       return new User(
         user.id,
         user.name,
         user.email,
         user.password,
         user.provider || undefined,
         user.providerId || undefined,
         user.avatar || undefined
       );
    }
    findAll(): User[] {
        return this.users; 
    }       
}

function uuidv4(): string {
    throw new Error("Function not implemented.");
}
