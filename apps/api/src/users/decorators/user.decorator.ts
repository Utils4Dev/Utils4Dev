import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from '../dto/user.dto';

export const AuthUser = createParamDecorator(
  (data: keyof UserDto, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as UserDto;

    return data ? user && user[data] : user;
  },
);
