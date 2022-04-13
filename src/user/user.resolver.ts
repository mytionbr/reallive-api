import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserFilter } from './dto/find-user.filter';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  findAll(): User[] {
    const users = this.userService.findAllUsers();
    return users;
  }

  @Query(() => User)
  findOne(
    @Args('findUserFilter', { type: () => FindUserFilter })
    findUserFilter: FindUserFilter,
  ): User {
    const { id, nickname } = findUserFilter;
    return this.userService.findOne(id, nickname);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserInput): User {
    const user = this.userService.createUser(data);
    return user;
  }
}
