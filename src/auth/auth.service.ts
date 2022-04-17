import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { User } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthConfig } from './auth-config';
import { RegisterUserInput } from './dto/register-user.input';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private authConfig: AuthConfig,
    private userService: UserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: authConfig.userPoolId,
      ClientId: authConfig.clientId,
    });
  }
  authenticateUser(user: {
    name: string;
    password: string;
  }): Promise<CognitoUserSession> {
    const { name, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });

    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async registerUser(
    registerUserInput: RegisterUserInput,
  ): Promise<CognitoUser> {
    const { email, password, nickname } = registerUserInput;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        nickname,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        async (error, result) => {
          if (!result) {
            reject(error);
          } else {
            const user = new User();
            user.nickname = nickname;
            user.email = email;
            const savedUser = await this.userService.saveUser(user);
            if (savedUser) {
              resolve(result.user);
            } else {
              const error = new Error('Algo deu errado');
              reject(error);
            }
          }
        },
      );
    });
  }
}
