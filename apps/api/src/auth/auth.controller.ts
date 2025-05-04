import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthUser } from 'src/users/decorators/user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guards/github.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

const { WEB_URL } = process.env;

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@AuthUser() user: UserDto) {
    return user;
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @UseGuards(GithubAuthGuard)
  @Get('/github/login')
  @ApiExcludeEndpoint()
  githubLogin() {}

  @UseGuards(GithubAuthGuard)
  @Get('/github/callback')
  @Redirect(WEB_URL)
  @ApiExcludeEndpoint()
  githubCallback(
    @AuthUser() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken: access_token } = this.authService.login(user);
    res.cookie('access_token', access_token, { httpOnly: true });
  }
}
