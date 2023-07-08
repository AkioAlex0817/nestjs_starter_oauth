import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, UserModule, CommonModule],
  providers: [],
  controllers: [ApiController],
  exports: [],
})
export class ApiModule {}
