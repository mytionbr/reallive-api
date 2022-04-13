import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfig {
  public userPoolId = process.env.COGNITO_USER_POOL_ID;
  public clientId = process.env.COGNITO_CLIENT_ID;
  public region = process.env.COGNITO_REGION;
  public authority = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
}
