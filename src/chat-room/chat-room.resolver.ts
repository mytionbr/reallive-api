import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { MessageService } from 'src/message/message.service';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomInfoOutput } from './dto/chat-room-info.output';
import { ChatRoomMessagesOutput } from './dto/chat-room-messages.output';
import { CreateChatRoomInput } from './dto/create-chat-room.input';
import { ChatRoom } from './model/chat-room.entity';

@Resolver()
export class ChatRoomResolver {
  constructor(private chatRoomService: ChatRoomService) {}

  @Mutation(() => ChatRoom)
  async createChatRoom(
    @Args('data') data: CreateChatRoomInput,
  ): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomService.createChatRoom(data);
    return chatRoom;
  }

  @Query(() => [ChatRoomInfoOutput])
  async findAllChatRoomsByUserId(@Args('userId') userId: string) {
    const chatRoomList = await this.chatRoomService.findByUserId(userId);
    return chatRoomList;
  }
  @Query(() => ChatRoomMessagesOutput)
  async findChatRoomWithMessages(@Args('chatRoomId') chatRoomId: string) {
    const chatRoom = await this.chatRoomService.findChatRoomWithMessages(
      chatRoomId,
    );

    return chatRoom;
  }
}
