import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoginUserOutput } from './dto/login-user.output';
import { RegisterUserInput } from './dto/register-user.input';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async register(@Args('data') data: RegisterUserInput) {
    try {
      const result = await this.authService.registerUser(data);

      if (result) {
        return true;
      }
      throw new Error('algo deu errado, tente novamente mais tarde');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => LoginUserOutput)
  async login(
    @Args('data')
    data: LoginUserInput,
  ) {
    try {
      const user = {
        name: data.nickname,
        password: data.password,
      };
      const result = await this.authService.authenticateUser(user);
      if (result) {
        const loginUserOutput: LoginUserOutput = {
          token: result.getIdToken().getJwtToken(),
        };

        return loginUserOutput;
      }
      throw new Error('algo deu errado, tente novamente mais tarde');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
