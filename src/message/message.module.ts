import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MessageSchema } from './schema/message.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'message',
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
