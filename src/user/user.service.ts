import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as  uuidv4 } from 'uuid'

import { USERS } from '../mocks/user.mock';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';


@Injectable()
export class UserService {
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
    user.password = data.password;
    user.id = uuidv4();

    this.users.push(user);

    return user;
  }

  private throwErrorIfUserNotFound(user: User) {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
