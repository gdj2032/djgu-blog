import { PathConfig } from './../framework/routes/routes';
import { store } from '@/stores'
import * as sha1 from 'sha1';
import { clearUserInfo, setUserInfo } from '@/stores/user'
import { isElectron } from '@/constants';
import { userService } from '@/services';
import { CreateWindowParam } from '@/electron/electron-client';
import Setting from './setting';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let timer: any;

export const doLogin = (params: any) => new Promise(async (resolve, reject) => {
  Setting.username = params.username
  Setting.password = params.remember ? params.password : ''
  store.dispatch(setUserInfo({ ...params, isLogin: true }));
  if (isElectron) {
    window.app.createWindowByName({ name: 'home' });
    timer = setTimeout(() => {
      // window.location.hash = PathConfig.home;
      window.app.closeWindow();
      timer = null;
      resolve(true)
    }, 1);
  } else {
    window.location.hash = PathConfig.home;
  }
  // const [, res] = await userService.login({ username: params.username, password });
  // if (res?.code === 200) {
  //   const { data } = res
  //   Setting.username = params.username
  //   Setting.password = params.remember ? params.password : ''
  //   store.dispatch(setUserInfo({ ...data, isLogin: true }));
  //   window.app.createWindowByName({ name: 'home' });
  //   timer = setTimeout(() => {
  //     // window.location.hash = PathConfig.home;
  //     window.app.closeWindow();
  //     timer = null;
  //     resolve(true)
  //   }, 1);
  // } else {
  //   reject(res?.message || '服务器错误')
  // }
})

export const doLogout = () => {
  store.dispatch(clearUserInfo())
  if (!isElectron) {
    window.location.hash = PathConfig.login
  } else {
    window.app.setWindowVisible(false);
    const createParams: CreateWindowParam = {
      name: 'login',
      intent: {
        data: {
          islogout: true,
        }
      },
    }
    window.app.createWindowByName(createParams);
    timer = setTimeout(() => {
      window.app.closeWindow(null, true);
      timer = null;
    }, 500);
  }
}
