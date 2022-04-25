import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { PUB_SUB } from 'src/common/constants';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MessageSchema } from './schema/message.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'message',
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [
    MessageResolver,
    MessageService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class MessageModule {}
