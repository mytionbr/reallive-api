import { Schema } from 'dynamoose';
import { UserSchema } from 'src/user/schema/user.schema';

export const MessageSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    context: {
      type: String,
    },
    user: {
      type: UserSchema,
    },
  },
  {
    timestamps: true,
  },
);
