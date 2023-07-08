import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestInterface } from '../../../type/user-request.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<UserRequestInterface>();
  if (!request.user) {
    return null;
  }
  if (data) {
    return request.user[data];
  }
  return request.user;
});
