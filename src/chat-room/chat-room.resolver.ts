import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomService } from './chat-room.service';
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
}
