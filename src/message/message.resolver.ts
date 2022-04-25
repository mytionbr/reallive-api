import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageService } from './message.service';
import { Message } from './model/message.entity';
import { PUB_SUB } from '../common/constants';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class MessageResolver {
  constructor(
    private messageService: MessageService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  async createMessage(@Args('data') data: CreateMessageInput) {
    const savedMessage = await this.messageService.createMessage(data);
    this.pubSub.publish('messageAdded', { messageAdded: savedMessage });
    return savedMessage;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => {
      return payload.messageAdded.chatRoomId === variables.chatRoomId;
    },
  })
  async messageAdded(@Args('chatRoomId') chatRoomId: string) {
    return this.pubSub.asyncIterator('messageAdded');
  }
}
