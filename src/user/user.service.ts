import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Condition } from 'dynamoose';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { UserToSave } from './dto/IUser';
import { User } from './model/user.entity';
import { UserKey } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User, UserKey>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.userModel.scan().exec();
    return users;
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
