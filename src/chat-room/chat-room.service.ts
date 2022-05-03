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
import { ChatRoomInfoOutput, LastMessages } from './dto/chat-room-info.output';

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

  async findByUserId(userId: string): Promise<ChatRoomInfoOutput[]> {
    const condition = new Condition('usersId').contains(userId);
    const chatRooms: ChatRoom[] = await this.chatRoomModel
      .scan(condition)
      .exec();
    const chatRoomListOutput = await this.parseChatRoomOutput(
      chatRooms,
      userId,
    );
    return chatRoomListOutput;
  }

  async findById(chatRoomId: string): Promise<ChatRoom> {
    const result: ChatRoom = await this.chatRoomModel.get({ id: chatRoomId });
    return result;
  }

  async findChatRoomWithMessages(
    chatRoomId: string,
    currentUserId: string,
  ): Promise<ChatRoomMessagesOutput> {
    const chatRoom = await this.findById(chatRoomId);
    const messages = await this.messageService.findByChatRoom(chatRoomId);
    const title = await this.addChatTitle(chatRoom, currentUserId);
    chatRoom.title = title;
    const chatRoomMessagesOutput: ChatRoomMessagesOutput = {
      ...chatRoom,
      messages,
    };

    return chatRoomMessagesOutput;
  }

  private async parseChatRoomOutput(
    chatRooms: ChatRoom[],
    userId: string,
  ): Promise<ChatRoomInfoOutput[]> {
    const chatRoomListOutput = Promise.all(
      chatRooms.map(async (chat) => {
        const title = await this.addChatTitle(chat, userId);
        const lastMessages = await this.addLastMessages(chat);

        const chatRoomInfoOutput: ChatRoomInfoOutput = {
          ...chat,
          title,
          lastMessages,
        };
        return chatRoomInfoOutput;
      }),
    );

    return chatRoomListOutput;
  }

  private async addChatTitle(
    chat: ChatRoom,
    currentUserId: string,
  ): Promise<string> {
    let title;
    if (chat.type === ChatRoomTypeEnum.SINGLE) {
      const otherUserId = chat.usersId.find((id) => id !== currentUserId);
      const otherUser = await this.userService.findOne({ id: otherUserId });
      title = otherUser.nickname;
    } else {
      title = chat.title;
    }
    return title;
  }

  private async addLastMessages(chat: ChatRoom) {
    const messages = await this.messageService.findByChatRoom(chat.id);
    const lastMessages = new LastMessages();
    if (messages) {
      lastMessages.count = messages.length;
      const lastMessage = messages[0];
      if (lastMessage) {
        const user = await this.userService.findOne({ id: lastMessage.userId });
        lastMessages.lastMessage = {
          content: lastMessage.content,
          updatedAt: lastMessage.createdAt,
          user: {
            nickname: user.nickname,
          },
        };
        lastMessages.viewed = lastMessage.viewed;
      } else {
        lastMessages.viewed = true;
      }
    }
    return lastMessages;
  }
}
