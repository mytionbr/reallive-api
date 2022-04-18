import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthConfig } from './auth-config';
import { UserModule } from 'src/user/user.module';
import { CognitoService } from './cognito.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [
    AuthConfig,
    AuthService,
    AuthResolver,
    JwtStrategy,
    CognitoService,
  ],
})
export class AuthModule {}
