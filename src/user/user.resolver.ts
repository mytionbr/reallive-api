import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { FindUserFilter } from './dto/find-user.filter';
import { User } from './model/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async findAll() {
    const users = await this.userService.findAllUsers();
    return users;
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async findOne(
    @Args('findUserFilter', { type: () => FindUserFilter })
    findUserFilter: FindUserFilter,
  ): Promise<User> {
    return await this.userService.findOne(findUserFilter);
  }
}
