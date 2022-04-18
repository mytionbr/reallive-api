import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Condition } from 'dynamoose';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';

import { USERS } from '../mocks/user.mock';
import { CreateUserInput } from './dto/create-user.input';
import { UserToSave } from './dto/IUser';
import { User } from './model/user.entity';
import { UserKey } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User, UserKey>,
  ) {}

  users: User[] = USERS;

  findAllUsers(): User[] {
    return this.users;
  }

  async findOne(userData: {
    id?: string;
    nickname?: string;
    email?: string;
  }): Promise<User> {
    if (userData?.id) {
      const user = await this.userModel.get({ id: userData.id });
      this.throwErrorIfUserNotFound(user);
      return user;
    }
    if (userData?.nickname) {
      const condition = new Condition({ nickname: userData.nickname });
      const result = await this.userModel.scan(condition).exec();
      const user = result[0];
      this.throwErrorIfUserNotFound(user);
      return user;
    }
    if (userData?.email) {
      const condition = new Condition({ email: userData.email });
      const result = await this.userModel.scan(condition).exec();
      const user = result[0];
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

  async saveUser(userToSave: UserToSave) {
    return await this.userModel.create({
      ...userToSave,
      id: uuidv4(),
    });
  }

  private throwErrorIfUserNotFound(user: User) {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
