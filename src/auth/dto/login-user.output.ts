import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';
import { CognitoIdToken } from 'amazon-cognito-identity-js';
import { TypeKind } from 'graphql';

@ObjectType()
export class LoginUserOutput {
  @Field()
  token!: string;
}
