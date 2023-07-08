import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserGuard } from '../auth/guard/user.guard';
import { User } from '../auth/decoration/user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { UserActiveGuard } from '../auth/guard/user-active.guard';

@Controller('api/user')
export class UserController {
  @UseGuards(UserGuard)
  @Get('status')
  status(@Req() req: any) {
    const user = <UserEntity>req.user;
    return { success: true, version: '1.0.1', build: 3, user_id: user.id };
  }
}
