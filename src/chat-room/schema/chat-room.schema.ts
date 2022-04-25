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
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
