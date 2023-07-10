import { config } from 'dotenv';
import { logger } from './logger';
import * as process from 'process';

config();

export const PORT = Number(process.env.PORT) || 3000;
export const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 30;

export const LOG_LEVEL_TYPEORM = LOG_LEVEL < 20 ? 'all' : ['schema', 'error', 'warn', 'info', 'log', 'migration'];

const DB_HOSTNAME = process.env.DB_HOSTNAME || '';
const DB_PORT = Number(process.env.DB_PORT) || 5432;
const DB_DATABASE = process.env.DB_DATABASE || 'postgres';
const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

export const DATABASE_CONFIG = {
  host: DB_HOSTNAME,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
};

export const JWT_SECRET = process.env.JWT_SECRET || '';
console.log('HOST: ', DATABASE_CONFIG.host);

export const MAIL_HOST = process.env.MAIL_HOST || '';
export const MAIL_PORT = process.env.MAIL_PORT || 2525;
export const MAIL_USERNAME = process.env.MAIL_USERNAME || '';
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || '';
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || '';
console.log('MAIL HOST: ', MAIL_HOST);
