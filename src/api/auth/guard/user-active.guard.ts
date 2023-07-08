import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UserRequestInterface } from '../../../type/user-request.interface';

export class UserActiveGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequestInterface>();
    if (request.user) {
      if (request.user.active) {
        return true;
      }
      throw new HttpException('Not activated', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
