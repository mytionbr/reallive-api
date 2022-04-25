import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export type ChatRoomKey = {
  id: string;
};

export enum ChatRoomTypeEnum {
  SINGLE = 'SINGLE',
  GROUP = 'GROUP',
}

registerEnumType(ChatRoomTypeEnum, {
  name: 'type',
});

@ObjectType()
export class ChatRoom {
  @Field(() => ID)
  id: string;
  @Field(() => [String])
  usersId: string[];
  @Field(() => String, { nullable: true })
  img?: string;
  @Field(() => String, { nullable: true })
  title?: string;
  @Field(() => String)
  updatedAt?: string;
  @Field(() => String)
  createdAt?: string;
  @Field(() => ChatRoomTypeEnum)
  type: ChatRoomTypeEnum;
}
