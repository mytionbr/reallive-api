import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/model/user.entity';

export type ChatRoomKey = {
  id: string;
};

@ObjectType()
export class ChatRoom {
  @Field(() => ID)
  id: string;
  @Field(() => [String])
  usersId: string[];
  @Field(() => String, { nullable: true })
  img?: string;
  @Field(() => String)
  title: string;
  @Field(() => String)
  updatedAt?: string;
  @Field(() => String)
  createdAt?: string;
}
