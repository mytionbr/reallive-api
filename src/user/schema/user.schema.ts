import { Schema } from 'dynamoose';

export const UserSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    nickname: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
