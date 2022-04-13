import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  nickname: string;
  @Field()
  password: string;
}
