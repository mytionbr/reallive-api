import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FindChatRoomInput {
  @Field(() => String)
  userId: string;
}
