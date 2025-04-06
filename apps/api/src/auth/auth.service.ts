import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUserGithubProvider(
    githubId: string,
    createUser: CreateUserDto,
  ): Promise<UserDto> {
    let user = await this.userService.findByGithubId(githubId);
    if (!user) user = await this.userService.create(createUser);

    return user;
  }

  login(user: UserDto) {
    const payload: JwtPayload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
