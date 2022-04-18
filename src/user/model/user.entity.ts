import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  constructor(id?: string) {
    this.id = id;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  email: string;
}
