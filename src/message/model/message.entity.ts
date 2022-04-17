import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/model/user.entity';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  context: string;
  @Field(() => User)
  user: User;
  @Field(() => String)
  createAt: string;
  @Field(() => Boolean)
  viewed: boolean;
  @Field(() => Boolean)
  received: boolean;
}
