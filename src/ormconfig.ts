import { ConnectionOptions } from 'typeorm';
import { DATABASE_CONFIG, LOG_LEVEL_TYPEORM } from './utils/const';

const config: ConnectionOptions = {
  type: 'postgres',
  ...DATABASE_CONFIG,
  entities: [`${__dirname}/database/entities/*{.ts,.js}`],
  migrations: [`${__dirname}/database/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: LOG_LEVEL_TYPEORM as
    | boolean
    | 'all'
    | Array<'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration'>,
  migrationsRun: false,
  migrationsTransactionMode: 'each',
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/database/entities',
  },
};
export default config;
