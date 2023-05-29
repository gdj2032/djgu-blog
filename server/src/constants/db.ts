import { PoolConfig } from "mysql";

const __DEV__ = process.env.NODE_ENV === 'development'

export const DATABASE_INFO: PoolConfig = {
  host: 'localhost',
  user: 'root',
  password: __DEV__ ? '12345678' : 'Gu1920948999',
  database: 'Blog',
  port: 3306,
};
