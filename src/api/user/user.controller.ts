import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserGuard } from '../auth/guard/user.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get('status')
  status(@Req() req: any) {
    const user = <UserEntity>req.user;
    return { success: true, version: '1.0.1', build: 3, user_id: user.id };
  }

  @UseGuards(UserGuard)
  @Get('profile')
  profile(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.userService.profile(user.id);
  }
}
