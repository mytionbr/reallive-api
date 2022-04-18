import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageService } from './message.service';
import { Message } from './model/message.entity';

@Resolver()
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Mutation(() => Message)
  async createMessage(@Args('data') data: CreateMessageInput) {
    const savedMessage = await this.messageService.createMessage(data);
    return savedMessage;
  }
}
