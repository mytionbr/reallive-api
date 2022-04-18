import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './model/message.entity';
import { MessageKey } from './schema/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('message')
    private readonly messageModel: Model<Message, MessageKey>,
  ) {}

  async createMessage(data: CreateMessageInput): Promise<Message> {
    const result = await this.messageModel.create({
      ...data,
      id: uuidv4(),
    });

    const savedMessage: Message = result;
    return savedMessage;
  }
}
