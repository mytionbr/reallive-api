import { Schema } from 'dynamoose';

export type UserKey = {
  id?: string;
  email?: string;
};

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
      rangeKey: true,
    },
  },
  {
    timestamps: true,
  },
);
