import os from "os";
import path from "path";

export const SERVER_PORT = 9999;

// session有效期3天
export const SESSION_TIME = 3 * 24 * 60 * 60 * 1000;

// 文件有效期 1天
export const FILE_TIME = 1 * 24 * 60 * 60 * 1000;

export const HOME_PATH = os.homedir();

export const FILE_PATH = `${HOME_PATH}/Project/blog/blog-sql/file`;

export const isDev = process.env.NODE_ENV === "development";

export const NGINX_FILE_PATH_CFG = {
  web: isDev ? `${FILE_PATH}/blog` : "/usr/share/nginx/html",
  server: isDev ? `${FILE_PATH}/dist` : "/usr/share/nginx/server/dist",
  tmp: isDev ? path.resolve("tmp") : "/usr/share/nginx/server/tmp",
};
