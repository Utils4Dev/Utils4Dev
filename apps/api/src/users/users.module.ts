import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubProvider } from './entities/github-provider.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, GithubProvider])],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
