import { BadRequestException, Injectable } from '@nestjs/common';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { UserToRegister, UserToSave } from 'src/user/dto/IUser';
import { User } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { CognitoService } from './cognito.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoginUserOutput } from './dto/login-user.output';
import { RegisterUserInput } from './dto/register-user.input';
import { VerifyEmailInput } from './dto/verift-user.input';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private userService: UserService,
    private cognitoService: CognitoService,
  ) {}

  async authenticateUser(data: LoginUserInput): Promise<LoginUserOutput> {
    try {
      const userInDB = await this.userService.findOne({ email: data.email });

      if (userInDB) {
        const userToAuth = {
          id: userInDB.id,
          password: data.password,
        };

        const authUser = await this.cognitoService.authenticateUser(userToAuth);

        if (authUser) {
          const loginUserOutput: LoginUserOutput = {
            token: authUser.getIdToken().getJwtToken(),
            userId: userInDB.id,
          };

          return loginUserOutput;
        }
      }

      throw new Error('algo deu errado, tente novamente mais tarde');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async registerUser(registerUserInput: RegisterUserInput): Promise<User> {
    const { email, password, nickname } = registerUserInput;

    try {
      const userToSave: UserToSave = {
        email,
        nickname,
      };

      const savedUser = await this.userService.saveUser(userToSave);

      const userToRegister: UserToRegister = {
        id: savedUser.id,
        email: savedUser.email,
        password,
      };

      const registedUser = await this.cognitoService.registerUser(
        userToRegister,
      );

      if (registedUser) {
        return savedUser;
      }

      throw new Error('Error ao registrar o usuário');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyEmail(data: VerifyEmailInput) {
    const { userId, code } = data;

    const result = await this.cognitoService.verifyEmail(userId, code);

    if (result) {
      return true;
    }

    throw new BadRequestException('Código invalido');
  }
}
