import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormconfig';
import { ApiModule } from './api/api.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './api/auth/middleware/auth.middleware';
import { AuthModule } from './api/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MAIL_FROM_ADDRESS, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from './utils/const';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
          user: MAIL_USERNAME,
          pass: MAIL_PASSWORD,
        },
      },
      defaults: {
        from: 'No Reply' + MAIL_FROM_ADDRESS,
      },
      /*template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },*/
    }),
    ApiModule,
    AuthModule,
    TypeOrmModule.forRoot(ormConfig),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 150,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
