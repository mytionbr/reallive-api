import { Field, InputType } from '@nestjs/graphql';
import { ChatRoomTypeEnum } from '../model/chat-room.entity';

@InputType()
export class CreateChatRoomInput {
  @Field(() => [String])
  usersId: string[];
  @Field(() => String, { nullable: true })
  title?: string;
  @Field(() => ChatRoomTypeEnum)
  type: ChatRoomTypeEnum;
}
