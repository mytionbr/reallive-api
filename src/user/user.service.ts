import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';

import { USERS } from '../mocks/user.mock';
import { CreateUserInput } from './dto/create-user.input';
import { User, UserKey } from './model/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User, UserKey>,
  ) {}

  users: User[] = USERS;

  findAllUsers(): User[] {
    return this.users;
  }

  findOne(id?: string, nickname?: string): User {
    if (id) {
      const user = this.users.find((user) => user.id === id);
      this.throwErrorIfUserNotFound(user);
      return user;
    }
    if (nickname) {
      const user = this.users.find((user) => user.nickname === nickname);
      this.throwErrorIfUserNotFound(user);
      return user;
    }

    throw new BadRequestException(
      'Adicione algum campo para pesquisa do usuário',
    );
  }

  createUser(data: CreateUserInput): User {
    const user = new User();
    user.nickname = data.nickname;
    user.email = data.email;
    user.id = uuidv4();

    this.users.push(user);

    return user;
  }

  async saveUser(user: User) {
    return await this.userModel.create({
      ...user,
      id: uuidv4(),
    });
  }

  private throwErrorIfUserNotFound(user: User) {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
