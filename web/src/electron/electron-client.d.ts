import { IpcRendererEvent, Display } from 'electron';
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
  father_id?: number;
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
export declare type AppConfig = {
  debugMode: boolean;
  commandParams: CommandParam;
  customAppSetting: number;
};
declare class ElectronClient {
  _logger: any;
  getLogger(): any;
  quit(): void;
  relaunch(code?: number): void;
  getHostInfo(): any;
  isPacked(): boolean;
  flushStorage(): void;
  enableWindowDrag(dragElement: HTMLElement): any;
  addWindowEventListener(event: string, cb: any, winId?: number): void;
  removeWindowEventListener(event: string, cb: any, winId?: number): void;
  sendMessage(id: number, message: string, data?: any): any;
  sendMessageToApp(message: string, data?: any): any;
  postMessageToApp(message: string, data?: any): void;
  sendMessageToCurrentWindow(message: string, data?: any): any;
  sendMessageToWndWeb(winId: number, message: string, data: any): void;
  postMessageToWnd(winId: string, message: string, data?: any): void;
  createWindowByName(param: CreateWindowParam, onResult?: (intentCode: string, resultCode: string | number, resultData: any) => void): number;
  getNativeWindowId(nativeId: string): any;
  setFullScreenChangeListener(cb: (fullscreen: boolean) => void, winId?: number): void;
  setFullScreen(fullscreen: boolean, winId?: number): void;
  isFullScreen(winId?: number): boolean;
  isFullScreenable(winId?: number): boolean;
  toggleFullScreen(winId?: number): void;
  isWindowVisible(winId?: number): boolean;
  setWindowVisible(visible: boolean, winId?: number): void;
  setWindowFeature(feature: {
    title?: string;
    size?: {
      width: number;
      height: number;
      animate?: boolean;
    };
  }, winId?: number): void;
  foregroundWindow(winId?: number): void;
  maximizeWindow(winId?: number): void;
  restoreWindow(winId?: number): void;
  minimizeWindow(winId?: number): void;
  getEleWindow(winId?: number): Electron.BrowserWindow;
  getFocusedWindow(): Electron.BrowserWindow;
  getWindowPosition(winId?: number): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  setWindowPosition(x: number, y: number, animate?: boolean, winId?: number): void;
  setWindowSize(width?: number, height?: number, animate?: boolean, winId?: number): void;
  closeWindow(winId?: number, forceClose?: boolean): void;
  /**
   * @param channel
   * @param func (event, message)=>{}
   */
  registerMessageListener(channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void): void;
  unregisterMessageListener(channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void): void;
  onGlobalHotKey(cb: (event: any, info: {
    code: string;
  }) => void): void;
  offGlobalHotKey(cb: (event: any, info: {
    code: string;
  }) => void): void;
  addGlobalHotKey(code: string, hotkeys: string, curWindowOnly?: boolean): boolean;
  removeGlobalHotKey(code: string, curWindowOnly?: boolean): void;
  getWindowIntent(): Intent;
  closeWindowWithResult(code: string | number, data: any): void;
  getScreen(): Electron.Screen;
  getDisplays(): Display[];
  private winMessageHookers;
  hookWindowMessage(message: number, cb: () => void): void;
  unhookWindowMessage(message: number, cb: () => void): void;
  getSysInfo(): any;
  openUrl(url: string): void;
  setBook(data: { filename: string, content: string, filepath: string }): { filepath: string, error: string }
  getBook(data: { filename: string }): { content: string, error: string }
}
declare global {
  interface Window {
    appConfig: AppConfig;
    app: ElectronClient;
    nativeWinId: number;
  }
  interface MediaStream {
    appData: any;
  }
}
export { };
