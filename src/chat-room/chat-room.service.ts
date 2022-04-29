import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateChatRoomInput } from './dto/create-chat-room.input';
import {
  ChatRoom,
  ChatRoomKey,
  ChatRoomTypeEnum,
} from './model/chat-room.entity';
import { v4 as uuidv4 } from 'uuid';
import { Condition } from 'dynamoose';
import { MessageService } from 'src/message/message.service';
import { ChatRoomMessagesOutput } from './dto/chat-room-messages.output';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel('chatRoom')
    private readonly chatRoomModel: Model<ChatRoom, ChatRoomKey>,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  async createChatRoom(data: CreateChatRoomInput): Promise<ChatRoom> {
    const result = await this.chatRoomModel.create({
      ...data,
      id: uuidv4(),
    });
    const savedChatRoom: ChatRoom = result;
    return savedChatRoom;
  }

  async findByUserId(userId: string): Promise<ChatRoom[]> {
    const condition = new Condition('usersId').contains(userId);
    const result: ChatRoom[] = await this.chatRoomModel.scan(condition).exec();
    const chatRooms = await this.parseChatTitle(result, userId);
    return chatRooms;
  }

  async findById(chatRoomId: string): Promise<ChatRoom> {
    const result: ChatRoom = await this.chatRoomModel.get({ id: chatRoomId });
    return result;
  }

  async findChatRoomWithMessages(
    chatRoomId: string,
  ): Promise<ChatRoomMessagesOutput> {
    const chatRoom = await this.findById(chatRoomId);
    const messages = await this.messageService.findByChatRoom(chatRoomId);

    const chatRoomMessagesOutput: ChatRoomMessagesOutput = {
      ...chatRoom,
      messages,
    };

    return chatRoomMessagesOutput;
  }

  private async parseChatTitle(
    chatRooms: ChatRoom[],
    currentUserId: string,
  ): Promise<ChatRoom[]> {
    const chatRoomResult = await Promise.all(
      chatRooms.map(async (chat) => {
        if (chat.type === ChatRoomTypeEnum.SINGLE) {
          const otherUserId = chat.usersId.find((id) => id !== currentUserId);
          const otherUser = await this.userService.findOne({ id: otherUserId });
          chat.title = otherUser.nickname;
        }
        return chat;
      }),
    );
    console.log(chatRoomResult);
    return chatRoomResult;
  }
}
