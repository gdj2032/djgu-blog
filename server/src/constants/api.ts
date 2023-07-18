import os from 'os'

export const SERVER_PORT = 9999;

// session有效期3天
export const SESSION_TIME = 3 * 24 * 60 * 60 * 1000;

// 文件有效期 1天
export const FILE_TIME = 1 * 24 * 60 * 60 * 1000;

export const HOME_PATH = os.homedir();

export const FILE_PATH = `${HOME_PATH}/testImage`

export const isDev = process.env.NODE_ENV === 'development'

export const NGINX_FILE_PATH_CFG = {
  web: isDev ? `${FILE_PATH}/blog` : '/usr/share/nginx/html/blog',
  server: isDev ? `${FILE_PATH}/dist` : '/usr/share/node/blog/dist',
}

