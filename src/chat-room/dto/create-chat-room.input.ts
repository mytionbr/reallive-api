import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChatRoomInput {
  @Field(() => [String])
  usersId: string[];
  @Field(() => String)
  title: string;
}
