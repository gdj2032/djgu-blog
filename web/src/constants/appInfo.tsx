import packageJson from '../../package.json';
// TODO: 修改以下字段


export const PAGE_SIZE = 10; // 默认table一页条数
export const INFINITE = 100000000;  // 默认请求时无限多条数据

export const VERSION = packageJson.version;
export const APPNAME = packageJson.name;
export const APPCODE = packageJson.name;
export const LOGO = require('@/images/logo.png');

console.info(' --------------- VERSION --------------- ', VERSION);
