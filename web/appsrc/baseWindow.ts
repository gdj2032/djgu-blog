import * as electron from 'electron';
import { BrowserWindow } from 'electron';
import { getFullUrl } from './utils';
import * as path from 'path';
import { Intent, IRemoteWindow } from './electron-client';
import MessageQueue from './mq';
import HotkeyMgr from './hotkeyMgr';

export default class BaseWindow {
  protected hostWnd: BrowserWindow;
  protected newWindows: Map<string, BrowserWindow> = new Map();
  protected winId: number;
  constructor(url: string, intent: Intent, options: electron.BrowserWindowConstructorOptions, urlOptions?: electron.LoadURLOptions) {
    options = options || {};
    options = {
      frame: false,
      backgroundColor: '#2F343E',
      autoHideMenuBar: false,
      show: false,
      center: false,
      ...options,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        plugins: true,
        webSecurity: false,
        preload: path.join(__dirname, 'electron-client.js'),
        ...options.webPreferences,
      },
    }

    // if (process.platform === 'darwin') {
    //   // Windows上transparent会引起各种问题
    //   options.transparent = true;
    // }
    // options.transparent = true;
    this.hostWnd = new BrowserWindow(options);
    this.winId = this.hostWnd.id;
    (this.hostWnd as IRemoteWindow).intent = intent;
    (this.hostWnd as IRemoteWindow).result = { code: 'cancel', data: undefined };
    require('@electron/remote/main').enable(this.hostWnd.webContents)
    this.init(url, urlOptions);
  }

  public getLogCategory(): string {
    return undefined;
  }
  public get id() {
    return this.hostWnd.isDestroyed() ? 0 : this.hostWnd.id;
  }
  public close() {
    this.hostWnd?.close();
  }
  protected init(url: string, options: electron.LoadURLOptions) {
    console.log('🚀 ~ file: baseWindow.ts ~ line 52 ~ BaseWindow ~ init ~ url', url)
    this.hostWnd.on('closed', async (e: electron.Event) => {
      await this.onClosed(e);
      this.hostWnd = null;
      MessageQueue.unregisterAllMessages(this.winId);
    })
    this.hostWnd.on('close', (e: electron.Event) => {
      this.onClosing(e);
    });
    this.hostWnd.once('ready-to-show', () => {
      this.onReadyShow();
    });
    this.hostWnd.webContents.on('new-window', (event, u, frameName, disposition, opt, additionalFeatures) => {
      this.onNewWindow(event, frameName, opt);
    })

    MessageQueue.registerMessage('getNativeWindowId', this.id, (winId) => {
      const win = this.newWindows.get(winId);
      if (!win) {
        return null;
      }
      return win.id;
    })
    MessageQueue.registerMessage('getLogCategory', this.id, () => {
      return this.getLogCategory();
    });

    if (!/.:\/\//.test(url)) {
      url = getFullUrl(url);
    }
    //this.hostWnd.setContentProtection(true);
    this.hostWnd.loadURL(url, options);
  }

  protected onNewWindow(event: any, name: string, options: electron.BrowserWindowConstructorOptions) {

    let props: {
      winName?: string;
      modal?: boolean;
      resizable?: boolean;
      id: string;
      title?: string;
      showInTaskBar?: boolean;
      topmost?: boolean;
      centerScreen?: boolean;
    } = { id: null };
    try {
      //const p = JSON.parse(Buffer.from(propBase64, 'base64').toString('binary'));
      const p = JSON.parse(name);
      props = { ...p };
      console.info('Recv New-Window', props);
    } catch (e) {
      console.error('onNewWindow Error', e);
      return;
    }
    if (!props.id) {
      console.error('onNewWindow Error, no ID');
      return;
    }
    event.preventDefault();
    options.resizable = props.resizable;
    // if (props.modal) {
    //   options.modal = true;
    //   options.parent = this.hostWnd;
    // }
    options.title = props.title;
    options.show = false;
    options.frame = false;
    options.backgroundColor = '#2F343E';
    options.minWidth = 0;
    options.minHeight = 0;
    options.skipTaskbar = !props.showInTaskBar;
    options.alwaysOnTop = props.topmost;
    options.center = props.centerScreen;

    if (props.modal) {
      options.modal = props.modal;
      //Electron的bug（可能设计就是这样），如果主窗口同时弹出两个模态框，当其中一个关掉的时候，另一个模态效果也消失，所以，需要把第二个模态框叠到当前模态框上。
      options.parent = this.hostWnd; //this.findLastModalChildren(this.hostWnd);
      options.skipTaskbar = true;
      // if (!this.hostWnd.isAlwaysOnTop()) {
      //   options.alwaysOnTop = false;
      // }
      if (options.alwaysOnTop) {
        options.parent = undefined;
      }
      //this.hostWnd.setEnabled(false);
    }

    console.info('onNewWindow new BrowserWindow');
    const newWindow = new BrowserWindow(options);
    const newWindowId = newWindow.id;
    console.info('onNewWindow record window', props.id, newWindow.id);
    this.newWindows.set(props.id, newWindow);
    newWindow.once('ready-to-show', () => {
      if (options.center) {
        newWindow.center();
      }
      console.info('onNewWindow ready to show', newWindow.id);
      newWindow.show();
    });
    if (options.alwaysOnTop) {
      newWindow.setAlwaysOnTop(true, 'screen-saver');
    }
    newWindow.on('close', (e: electron.Event) => {
      if (!newWindow.isDestroyed() && !newWindow.webContents.isDestroyed()) {
        this.hostWnd.webContents.send('closingWindow', { winId: newWindow.id });
      }
      e.preventDefault();
    })

    newWindow.on('closed', (e: electron.Event) => {
      this.enableHostIfNoModal();
      console.info('onNewWindow newWindow Closed, clear ID');
      this.newWindows.delete(props.id);
      HotkeyMgr.unregisterHotKeyForWindow(newWindowId);
    })
    event.newGuest = newWindow;
    console.info('onNewWindow Finish');
  }
  protected onShow() {

  }

  private enableHostIfNoModal() {
    if (this.hostWnd && !this.hostWnd.isDestroyed()) {
      const cws = this.hostWnd.getChildWindows();
      for (const w of cws) {
        if (!w.isDestroyed() && w.isModal()) {
          this.hostWnd.setEnabled(false);
          return;
        }
      }
      this.hostWnd.setEnabled(true);
    }
  }

  private findLastModalChildren(win: BrowserWindow) {
    let child = win;
    if (win) {
      const cws = win.getChildWindows();
      for (const w of cws) {
        if (!w.isDestroyed() && w.isModal()) {
          child = this.findLastModalChildren(w);
          break;
        }
      }
    }
    return child;
  }

  protected onReadyShow() {
    this.hostWnd.show();
    this.onShow();
    console.info('showing window...');
  }
  //Return false to cancel the close
  protected onClosing(e: electron.Event) {
    if (!this.hostWnd.isDestroyed() && !this.hostWnd.webContents.isDestroyed()) {
      this.hostWnd.webContents.send('closingWindow', { winId: this.hostWnd.id });
    }
    e.preventDefault();
    return;
  }
  protected async onClosed(e: electron.Event): Promise<void> {
    HotkeyMgr.unregisterHotKeyForWindow(this.winId);
  }
}
