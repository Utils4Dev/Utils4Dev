import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../types/jwt-payload';

const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload) {
    return await this.userService.findById(payload.sub);
  }
}

function cookieExtractor(req: Request) {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'] as string;
  }
  return token;
}
