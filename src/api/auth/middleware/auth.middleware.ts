import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { JWT_SECRET } from '../../../utils/const';
import { AuthService } from '../auth.service';
import { UserRequestInterface } from '../../../type/user-request.interface';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: UserRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedJwt = verify(token, JWT_SECRET);
      const user: UserEntity | null = await this.authService.getUserById(Number(decodedJwt['id']));
      if (user != null && user.accessToken != null && user.refreshToken != null) {
        const type: string =
          user.accessToken == token ? 'access_token' : user.refreshToken == token ? 'refresh_token' : '';
        switch (type) {
          case 'access_token':
            if (user.expiryAccessDate.getTime() > Date.now()) {
              req.user = user;
              next();
              return;
            } else {
              req.user = null;
              next();
              return;
            }
          case 'refresh_token':
            if (user.expiryRefreshDate.getTime() > Date.now()) {
              req.user = user;
              next();
              return;
            } else {
              req.user = null;
              next();
              return;
            }
        }
        req.user = null;
        next();
      } else {
        req.user = null;
        next();
      }
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
