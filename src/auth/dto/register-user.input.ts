import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@InputType()
export class RegisterUserInput extends CreateUserInput {}
