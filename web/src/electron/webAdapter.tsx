import { PathConfig } from '@/framework/routes/routes';
import { CreateWindowParam, Intent } from './electron-client'

declare global {
  //tslint:disable-next-line:interface-name
  interface Window {
    closeChildrenWindow(w: Window);
  }
  //tslint:disable-next-line:interface-name
  interface MediaStream {
    appData: any;
  }
}
const createWindowByName = (param: CreateWindowParam, OnResult?: (intentCode: string, resultCode: string | number, resultData: any) => void): any => {
  if (OnResult) {
    console.warn('onResult() is not support in Web mode');
  }
  let w: Window = window;
  let intentQuery = '';
  if (param.intent) {
    const intentJson = JSON.stringify(param.intent);
    intentQuery = `?intent=${btoa(encodeURIComponent(intentJson))}`;
  }
  if (!PathConfig[param.name]) {
    console.error('PathConfig pages', Object.keys(PathConfig));
    throw new Error(`无法找到页面${param.name}的路径， 请确保创建窗口的name和在PathConfig中存在(参考pages/pageRoutes.tsx)`);
  }
  if (!param.newWebWin) {
    window.location.hash = `${PathConfig[param.name]}${intentQuery}`;
  } else {
    w = window.open(`#${PathConfig[param.name]}${intentQuery}`, '_blank');   //新开一个页面
  }
  return w;
}

const closeWindow = (win: Window, forceClose?: boolean) => {
  win = win || window;
  if (win.opener && win.opener.closeChildrenWindow) {
    win.opener.closeChildrenWindow(win);
  }
}

const setWindowVisible = (visible: boolean, win: Window) => {
  if (win && visible) {
    win.focus();
  }
}
const getWindowIntent = () => {
  const hashSearch = window.location.hash.substr(window.location.hash.indexOf('?'));
  const params = new URLSearchParams(hashSearch);
  const intentString = params.get('intent');
  if (intentString) {
    try {
      const jsonString = decodeURIComponent(atob(intentString));
      const intent: Intent = JSON.parse(jsonString);
      return intent;
    } catch (e) {
      console.error('parse intent failed : ', window.location.hash);
    }
  }
  return null;
}
//备用，万一要实现网页的快捷键呢
const onGlobalHotKey = (cb: (info: { code: string }) => void) => {

}

const addGlobalHotKey = (code: string, hotkeys: string, curWindowOnly?: boolean) => {
  return false;
}
const removeGlobalHotKey = (code: string) => {

}

export const initailWebEnv = () => {
  window.appConfig = {
    debugMode: false,
    customAppSetting: 0,
    commandParams: {
      features: {
        f1: false,
        f2: '',
      }
    },
  };
  window.app = {
    createWindowByName,
    closeWindow,
    getWindowIntent,
    onGlobalHotKey,
    addGlobalHotKey,
    removeGlobalHotKey,
    setWindowVisible,
    sendMessageToApp: (msg: any, data: any) => {
      console.warn('sendMessageToApp not available', msg);
    }

  } as any;

}

window.closeChildrenWindow = (w: Window) => {
  console.info('closing chilren');
  w.close();
}
