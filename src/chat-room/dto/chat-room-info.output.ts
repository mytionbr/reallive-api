import { Field, ObjectType } from '@nestjs/graphql';
import { ChatRoom } from '../model/chat-room.entity';

@ObjectType()
export class UserMessage {
  @Field(() => String)
  nickname: string;
}

@ObjectType()
export class LastMessage {
  @Field(() => String)
  content: string;
  @Field(() => UserMessage)
  user: UserMessage;
  @Field(() => String)
  updatedAt: string;
}

@ObjectType()
export class LastMessages {
  @Field(() => Boolean)
  viewed: boolean;
  @Field(() => Number)
  count: number;
  @Field(() => LastMessage, { nullable: true })
  lastMessage?: LastMessage;
}

@ObjectType()
export class ChatRoomInfoOutput extends ChatRoom {
  @Field(() => LastMessages)
  lastMessages?: LastMessages;
}
