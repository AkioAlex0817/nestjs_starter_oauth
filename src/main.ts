import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './utils/logger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PORT } from './utils/const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(/*{ transform: true }*/));
  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });

  await app.listen(PORT, () => {
    logger.debug(`Listening at ${PORT}`);
  });
}
bootstrap();
