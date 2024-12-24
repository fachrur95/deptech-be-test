import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const nodeEnv = process.env.STAGE || 'dev';

dotenv.config({ path: `.env.stage.${nodeEnv}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_SCHEMA,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
