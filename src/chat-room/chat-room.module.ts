import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ChatRoomResolver } from './chat-room.resolver';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomSchema } from './schema/chat-room.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'chatRoom',
        schema: ChatRoomSchema,
      },
    ]),
  ],
  providers: [ChatRoomResolver, ChatRoomService],
})
export class ChatRoomModule {}
