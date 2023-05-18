import { PathConfig } from './../framework/routes/routes';
import { store } from '@/stores'
import { clearUserInfo, setUserInfo } from '@/stores/user'
import { microAction } from '@/micro';

export const doLogin = (params: any) => {
  store.dispatch(setUserInfo(params))
  // 子应用需要同步主应用用户信息
  microAction.setGlobalState({ user: params });
  window.location.hash = PathConfig.home
}

export const doLogout = () => {
  store.dispatch(clearUserInfo())
  window.location.hash = PathConfig.login
}
