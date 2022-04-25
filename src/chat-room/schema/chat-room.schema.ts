import { Schema } from 'dynamoose';
import { ChatRoomTypeEnum } from '../model/chat-room.entity';

export const ChatRoomSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    usersId: {
      type: Array,
      schema: [String],
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: [...Object.values(ChatRoomTypeEnum)],
    },
  },
  {
    timestamps: true,
  },
);
