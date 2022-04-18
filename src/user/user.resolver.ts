import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserFilter } from './dto/find-user.filter';
import { User } from './model/user.entity';
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
  async findOne(
    @Args('findUserFilter', { type: () => FindUserFilter })
    findUserFilter: FindUserFilter,
  ): Promise<User> {
    return await this.userService.findOne(findUserFilter);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserInput): User {
    const user = this.userService.createUser(data);
    return user;
  }
}
