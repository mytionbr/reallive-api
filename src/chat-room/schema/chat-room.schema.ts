import { Schema } from 'dynamoose';

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
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
