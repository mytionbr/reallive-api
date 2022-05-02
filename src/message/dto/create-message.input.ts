import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  content: string;
  @Field(() => String)
  userId: string;
  @Field(() => String)
  chatRoomId: string;
}
