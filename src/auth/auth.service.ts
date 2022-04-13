import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth-config';
import { RegisterUserInput } from './dto/register-user.input';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private authConfig: AuthConfig) {
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
        (error, result) => {
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
