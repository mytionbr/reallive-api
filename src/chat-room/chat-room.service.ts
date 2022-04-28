import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateChatRoomInput } from './dto/create-chat-room.input';
import { ChatRoom, ChatRoomKey } from './model/chat-room.entity';
import { v4 as uuidv4 } from 'uuid';
import { Condition } from 'dynamoose';
import { MessageService } from 'src/message/message.service';
import { ChatRoomMessagesOutput } from './dto/chat-room-messages.output';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel('chatRoom')
    private readonly chatRoomModel: Model<ChatRoom, ChatRoomKey>,
    private messageService: MessageService,
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

    return result;
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
}
