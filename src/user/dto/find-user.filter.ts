import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindUserFilter {
  @Field({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  email?: string;
}
