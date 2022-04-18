import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { UserToRegister } from 'src/user/dto/IUser';
import { User } from 'src/user/model/user.entity';
import { AuthConfig } from './auth-config';
import { RegisterUserInput } from './dto/register-user.input';

@Injectable()
export class CognitoService {
  private userPool: CognitoUserPool;

  constructor(private authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  authenticateUser(user: {
    id: string;
    password: string;
  }): Promise<CognitoUserSession> {
    const { id, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: id,
      Password: password,
    });

    const userData = {
      Username: id,
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

  async registerUser(userToRegister: UserToRegister): Promise<CognitoUser> {
    const { id, email, password } = userToRegister;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        id,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        async (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }
}
