import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/message/model/message.entity';
import { ChatRoom } from '../model/chat-room.entity';

@ObjectType()
export class ChatRoomMessagesOutput extends ChatRoom {
  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}
