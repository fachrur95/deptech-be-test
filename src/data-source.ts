import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const nodeEnv = process.env.STAGE || 'dev';

dotenv.config({ path: `.env.stage.${nodeEnv}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
