import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './passport-strategies/github.strategy';
import { JwtStrategy } from './passport-strategies/jwt.strategy';

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRATION },
    }),
  ],
  providers: [AuthService, GithubStrategy, JwtStrategy],
})
export class AuthModule {}
