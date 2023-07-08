import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity])],
  providers: [],
  exports: [],
})
export class CommonModule {}
