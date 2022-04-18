import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  context: string;
  @Field(() => String)
  userId: string;
  @Field(() => String)
  chatRoomId: string;
  @Field(() => String)
  createdAt?: string;
  @Field(() => Boolean)
  viewed?: boolean;
  @Field(() => Boolean)
  received?: boolean;
}
