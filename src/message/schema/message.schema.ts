import { Schema } from 'dynamoose';

export type MessageKey = {
  id: string;
};

export const MessageSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    context: {
      type: String,
    },
    userId: {
      type: String,
    },
    chatRoomId: {
      type: String,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    received: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
