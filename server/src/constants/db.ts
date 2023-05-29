import { PoolConfig } from "mysql";
import { isDev } from "./api";

export const DATABASE_INFO: PoolConfig = {
  host: 'localhost',
  user: 'root',
  password: isDev ? '12345678' : 'Gdj!137159',
  database: 'Blog',
  port: 3306,
};
