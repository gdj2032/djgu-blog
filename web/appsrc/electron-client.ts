import { ipcRenderer, IpcRendererEvent, desktopCapturer, Display, app } from 'electron';
const remote = require('@electron/remote');

export declare type Intent = {
  code?: string;
  data?: any;
};
export declare type WinResult = {
  code?: number | string;
  data?: any;
};
export declare type CreateWindowParam = {
  name: string;
  isChild?: boolean;
  isModal?: boolean;
  intent?: Intent;
  userParam?: any;
  parentId?: number;
  /**
   * Web模式下，是否打开新标签: target='_blank'
   */
  newWebWin?: boolean;
};
export interface IRemoteWindow {
  intent?: Intent;
  result?: WinResult;
  on?: any;
}
export declare type DisplayInfoEx = {
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dpi: {
    x: number;
    y: number;
  };
};
export declare type CommandParam = {
  features: {
    f1: boolean;
    f2: string;
  };
};
export declare type AppConfig = { // 配置文件类型定义
  debugMode: boolean;
  commandParams: CommandParam;
  customAppSetting: number;
};

interface IRemoteLogger {
  trace(...args: any[]): void;
  log(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
class ElectronClient {
  public _logger = remote.getGlobal('console');

  public getLogger() {
    return this._logger;
  }

  public quit() { // 退出
    remote.app.exit(0);
  }

  public relaunch(code: number = 0) {
    //不要使用electron自己的relaunch，非常慢的问题，有一个不知道什么进程好久才退出
    //发消息到底层去处理
    this.postMessageToApp('relaunch');
  }
  getHostInfo() { // 操作系统 CPU 架构 x64 x32 ia32...
    return this.sendMessageToApp('hostInfo');
  }

  isPacked() { // 应用是否被打包
    return remote.app.isPackaged;
  }
  //#endregion
  flushStorage() {
    remote.session.defaultSession.flushStorageData();
  }
  enableWindowDrag(dragElement: HTMLElement): any { // 应用窗口拖动
    try {
      const electronDrag = require('electron-drag');
      if (electronDrag.supported) {
        return electronDrag(dragElement);

      } else {
        console.error('unsupport electron-drag');
      }
    } catch (ex) {
      console.error('unsupport electron-drag', ex);
    }
    dragElement.setAttribute('style', '-webkit-app-region: drag;');
    return null;
  }
  addWindowEventListener(event: string, cb: any, winId?: number) { // 窗口监听 参考PageFrame
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    win && win.addListener(event as any, cb);
  }
  removeWindowEventListener(event: string, cb: any, winId?: number) { // 窗口取消监听
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    win && win.removeListener(event as any, cb)
  }

  sendMessage(id: number, message: string, data?: any): any { // 发送消息到指定winId的窗口
    return ipcRenderer.sendSync(message, { winId: id, data: data });
  }
  sendMessageToApp(message: string, data?: any) { // 发送消息到app
    return ipcRenderer.sendSync(message, { winId: 0, data: data });
  }
  postMessageToApp(message: string, data?: any) {
    return ipcRenderer.send(message, { winId: 0, data: data });
  }
  sendMessageToCurrentWindow(message: string, data?: any): any { // 发送消息到当前窗口
    return ipcRenderer.sendSync(message, { winId: remote.getCurrentWindow().id, data: data });
  }

  sendMessageToWndWeb(winId: number, message: string, data: any) {
    const win = remote.BrowserWindow.fromId(winId);
    win.webContents.send(message, data);
  }

  postMessageToWnd(winId: string, message: string, data?: any) {
    return ipcRenderer.send(message, { winId: winId || remote.getCurrentWindow().id, data: data });
  }
  // 新建窗口
  createWindowByName(param: CreateWindowParam, onResult?: (intentCode: string, resultCode: string | number, resultData: any) => void): number {
    if (onResult || param.isChild || param.isModal) {
      param.parentId = remote.getCurrentWindow().id;
    }
    const winId = this.sendMessageToApp('show-window', param);
    if (winId) {
      const win = remote.BrowserWindow.fromId(winId) as IRemoteWindow;
      if (onResult) {
        win.on('closed', () => {
          const resultCode = win.result ? win.result.code : undefined;
          const resultData = win.result ? win.result.data : undefined;
          const intentCode = param.intent ? param.intent.code : '';
          onResult(intentCode, resultCode, resultData);
        });
      }
    }
    return winId;
  }

  // 获取窗口对应Id
  getNativeWindowId(nativeId: string) {
    const id = this.sendMessageToCurrentWindow('getNativeWindowId', nativeId);
    return id;
  }

  // 全屏change监听
  setFullScreenChangeListener(cb: (fullscreen: boolean) => void, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.on('enter-full-screen', () => {
      cb(true);
    });
    win.on('leave-full-screen', () => {
      cb(false);
    })
  }
  // 全屏设置
  setFullScreen(fullscreen: boolean, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.setFullScreen(fullscreen);
  }
  // 判断是否全屏
  isFullScreen(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    return win.isFullScreen();
  }
  // 是否可全屏
  isFullScreenable(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    return win.isFullScreenable();
  }
  // 切换窗口全屏
  toggleFullScreen(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    if (win.isFullScreen()) {
      win.setFullScreen(false);
    } else if (win.isFullScreenable()) {
      win.setFullScreen(true);
    }
  }
  // 窗口是否可见
  isWindowVisible(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    return win && win.isVisible();
  }
  // 控制窗口显示隐藏
  setWindowVisible(visible: boolean, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    console.info('set window visible ', win.id, visible);
    visible ? win.show() : win.hide();
  }
  // 控制窗口title/size
  setWindowFeature(feature: { title?: string; size?: { width: number; height: number; animate?: boolean } }, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (feature.title) {
      win.setTitle(feature.title);
    }
    if (feature.size) {
      win.setSize(feature.size.width, feature.size.height, feature.size.animate);
    }
  }

  foregroundWindow(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (win) {
      win.setAlwaysOnTop(true);
      win.setAlwaysOnTop(false);
    }
  }
  // 控制窗口最大化
  maximizeWindow(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    if (!win.resizable) {
      return;
    }
    if (win.isMaximized()) {
      win.unmaximize();
    } else if (win.maximizable) {
      win.maximize();
    }
  }
  // 从最大化恢复
  restoreWindow(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.unmaximize();
  }
  // 控制窗口最小化
  minimizeWindow(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.minimize();
  }
  // 根据窗口id获取窗口实例
  getEleWindow(winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    return win;
  }
  // 获取当前激活的窗口
  getFocusedWindow() {
    return remote.BrowserWindow.getFocusedWindow();
  }
  // 计算窗口在屏幕中的位置
  getWindowPosition(winId?: number): { x: number; y: number; width: number; height: number } {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return undefined;
    }
    const position = win.getPosition();
    const size = win.getSize();
    return { x: position[0], y: position[1], width: size[0], height: size[1] };
  }
  // 设置窗口在屏幕中的位置
  setWindowPosition(x: number, y: number, animate?: boolean, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.setPosition(x, y, animate);
  }
  // 设置窗口大小
  setWindowSize(width?: number, height?: number, animate?: boolean, winId?: number) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    win.setSize(width, height, animate);
  }

  // 控制窗口关闭(是否强制关闭)
  closeWindow(winId?: number, forceClose?: boolean) {
    const win = winId ? remote.BrowserWindow.fromId(winId) : remote.getCurrentWindow();
    if (!win) {
      return;
    }
    if (forceClose) {
      win.hide();
    }
    forceClose ? win.destroy() : win.close();
  }

  /**
   * @param channel
   * @param func (event, message)=>{}
   */
  // web层监听node层的消息
  registerMessageListener(channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.on(channel, func);
  }
  // 取消监听
  unregisterMessageListener(channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.off(channel, func);
  }
  // 全局快捷键监听
  onGlobalHotKey(cb: (event: any, info: { code: string }) => void) {
    this.registerMessageListener('hotkeyClicked', cb);
  }
  // 全局快捷键取消监听
  offGlobalHotKey(cb: (event: any, info: { code: string }) => void) {
    this.unregisterMessageListener('hotkeyClicked', cb);
  }
  // 注册全局快捷键
  addGlobalHotKey(code: string, hotkeys: string, curWindowOnly: boolean = true): boolean {
    const winId = curWindowOnly ? remote.getCurrentWindow().id : null;
    return this.sendMessageToApp('regGlobalHotKey', { winId, code, hotkeys });
  }
  // 取消注册全局快捷键
  removeGlobalHotKey(code: string, curWindowOnly: boolean = true) {
    const winId = curWindowOnly ? remote.getCurrentWindow().id : null;
    this.sendMessageToApp('unregGlobalHotKey', { code, winId });
  }
  // 获取当前窗口的Intent值
  getWindowIntent() {
    return (remote.getCurrentWindow() as IRemoteWindow).intent;
  }

  closeWindowWithResult(code: string | number, data: any) {
    const curWindow = remote.getCurrentWindow();
    (curWindow as IRemoteWindow).result = { code, data };
    this.closeWindow();
  }
  // 屏幕实例
  getScreen(): Electron.Screen {
    return remote.screen;
  }
  // 获取所有屏幕的相关信息
  getDisplays(): Display[] {
    return remote.screen.getAllDisplays();
  }

  private winMessageHookers: Map<number, Array<() => void>> = new Map();
  hookWindowMesssage(message: number, cb: () => void) {
    if (process.platform !== 'win32') {
      return;
    }
    const hookers = this.winMessageHookers.get(message) || [];
    for (const c of hookers) {
      if (c === cb) {
        return;
      }
    }
    hookers.push(cb);
    this.winMessageHookers.set(message, hookers);
    if (hookers.length === 1) {
      remote.getCurrentWindow().hookWindowMessage(message, () => {
        const curHookers = this.winMessageHookers.get(message) || [];
        for (const hookFunc of curHookers) {
          hookFunc();
        }
      });
    }
  }
  unhookWindowMesssage(message: number, cb: () => void) {
    if (process.platform !== 'win32') {
      return;
    }
    const hookers = this.winMessageHookers.get(message) || [];
    for (let i = 0; i < hookers.length; i++) {
      if (hookers[i] === cb) {
        hookers.splice(i, 1);
      }
    }
    if (hookers.length === 0) {
      remote.getCurrentWindow().unhookWindowMessage(message);
    }
  }
  // 获取系统信息 内存 cpu 操作系统...
  getSysInfo() {
    const sysInfo = this.sendMessageToApp('getSysInfo', null);
    return sysInfo;
  }

  realmCreate(data: { name: string; params: any }) {
    this.sendMessageToApp('realm-create', data);
  }

  realmFind(name: string) {
    return this.sendMessageToApp('realm-find', name);
  }

  realmFindKey(data: { name: string; key: any }) {
    this.sendMessageToApp('realm-findKey', data);
  }

  realmModify(data: { name: string; key: any; params: any }) {
    this.sendMessageToApp('realm-modify', data);
  }

  realmDelete(data: { name: string; key: any }) {
    this.sendMessageToApp('realm-delete', data);
  }
}

// tslint:disable-next-line: interface-name
declare global {
  // tslint:disable-next-line: interface-name
  interface Window { appConfig: AppConfig; app: ElectronClient; nativeWinId: number }
  interface MediaStream { appData: any; }
}

window.app = new ElectronClient(); // 底层方法调用
window.appConfig = window.app.sendMessageToApp('getConfig'); // 获取配置文件
window.nativeWinId = remote.getCurrentWindow().id; // 当前窗口id

// const orgLogger: IRemoteLogger = {
//   log: window.console.log.bind(window.console),
//   trace: window.console.trace.bind(window.console),
//   debug: window.console.debug.bind(window.console),
//   info: window.console.info.bind(window.console),
//   warn: window.console.warn.bind(window.console),
//   error: window.console.error.bind(window.console),
// };

// const logCategory = window.app.sendMessageToCurrentWindow('getLogCategory');

// if (true) {
//   // if (remote.app.isPackaged) {
//   window.console.trace = (message?: any, ...args: any[]) => {
//     orgLogger.trace(message, args);
//     window.app.getLogger().trace({ webLog666: true, logCategory: logCategory }, ...args);
//   }
//   window.console.log = (message?: any, ...args: any[]) => {
//     orgLogger.log(message, args);
//     window.app.getLogger().log({ webLog666: true, logCategory: logCategory }, ...args);
//   }
//   window.console.debug = (message?: any, ...args: any[]) => {
//     orgLogger.debug(message, args);
//     window.app.getLogger().debug({ webLog666: true, logCategory: logCategory }, ...args);
//   }
//   window.console.info = (message?: any, ...args: any[]) => {
//     orgLogger.info(message, args);
//     window.app.getLogger().info({ webLog666: true, logCategory: logCategory }, ...args);
//   }
//   window.console.warn = (...args: any[]) => {
//     orgLogger.warn.apply(args);
//     window.app.getLogger().warn({ webLog666: true, logCategory: logCategory }, ...args);
//   }

//   window.console.error = (...args: any[]) => {
//     orgLogger.error.apply(args);
//     try {
//       const j = JSON.stringify(args);
//       window.app.getLogger().error({ webLog666: true, logCategory: logCategory }, ...args);
//     } catch (e) {
//       orgLogger.error('failed to log to File');
//     }
//   }
// }
