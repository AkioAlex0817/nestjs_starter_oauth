import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
