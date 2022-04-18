import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyEmailInput {
  @Field()
  userId: string;
  @Field()
  code: string;
}
