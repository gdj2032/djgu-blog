/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-07-20 14:24:19
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 14:02:57
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import { PathConfig } from './../framework/routes/routes';
import { store } from '@/stores'
import * as sha1 from 'sha1';
import { clearUserInfo, setUserInfo } from '@/stores/user'
import { userService } from '@/services';
import Setting from './setting';
import { message } from 'antd';
import { initRoutes } from './util';

export const doLogin = (params: any) => new Promise(async (resolve, reject) => {
  const res = await userService.login({
    username: params.username,
    password: sha1(params.password)
  });
  console.info('--- res --->', res);
  if (res?.code === 200) {
    const { data } = res
    Setting.username = params.username
    Setting.password = params.remember ? params.password : ''
    Setting.session = res.data.session
    store.dispatch(setUserInfo({ ...data, isLogin: true }));
    message.success('登录成功')
    window.location.hash = PathConfig.home;
    initRoutes()
    // if (isElectron) {
    //   window.app.createWindowByName({ name: 'home' });
    //   timer = setTimeout(() => {
    //     window.location.hash = PathConfig.home;
    //     window.app.closeWindow();
    //     timer = null;
    //     resolve(true)
    //   }, 1);
    // } else {
    //   window.location.hash = PathConfig.home;
    // }
  } else {
    reject(res?.message || '服务器错误')
  }
})

export const doLogout = (info?: { tip?: string | boolean, type?: 'success' | 'error' }) => {
  const { tip = true, type = 'success' } = info || {};
  store.dispatch(clearUserInfo())
  if (tip) {
    if (type === 'success') {
      const msg = typeof tip === 'string' ? tip : '登出成功'
      message.success(msg)
    } else {
      const msg = typeof tip === 'string' ? tip : '已登出'
      message.error(msg)
    }
  }
  window.location.hash = PathConfig.home
  // if (!isElectron) {
  //   window.location.hash = PathConfig.home
  // } else {
  //   window.app.setWindowVisible(false);
  //   const createParams: CreateWindowParam = {
  //     name: 'login',
  //     intent: {
  //       data: {
  //         islogout: true,
  //       }
  //     },
  //   }
  //   window.app.createWindowByName(createParams);
  //   timer = setTimeout(() => {
  //     window.app.closeWindow(null, true);
  //     timer = null;
  //   }, 500);
  // }
}
