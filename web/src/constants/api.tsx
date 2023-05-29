import { isElectron } from '@/electron/constants';
export const mockSwitch = 0; // mock开关
const isProduction = process.env.NODE_ENV !== 'development';
const Credentials = 'include'; // include 跨域使用 、 same-origin 同源使用

const __DEV__ = process.env.NODE_ENV === 'development'

let API_HOST = ''

if (isProduction) {
  // API_HOST = 'http://116.62.21.79:9999';
  API_HOST = '/api';
} else {
  API_HOST = !mockSwitch ? '/api' : '/mock';
}

export {
  API_HOST,
  Credentials,
  __DEV__,
  isElectron,
};
