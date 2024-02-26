import { app, BrowserWindow, dialog, globalShortcut, shell } from 'electron';
import MessageQueue from './mq';
import BaseWindow from './baseWindow';
import { CreateWindowParam } from './electron-client';
import { getAppConfig, getResourcePath } from './utils';
import Logger from './logger';
import HotkeyMgr from './hotkeyMgr';
import * as os from 'os';
import BookUtil from './bookUtil';

const childProcess = require('child_process');

export default class App {
  static sysInfo: any = null;
  static instance: App = null;
  private _isQuit = false;
  private bookUtil: BookUtil;
  public get isQuit() {
    return this._isQuit;
  }
  constructor() {
    this.bookUtil = new BookUtil();
    App.instance = this;

    process.on('uncaughtException', (err: any) => {
      if (this.isQuit) {
        return;
      }
      console.error('GlobalError', err);
      dialog.showErrorBox(err.message, err.stack);
      app.exit();
    });
    process.on('unhandledRejection', (reason, p) => {
      console.error('GlobalUnhandledRejection', reason, p);
      // dialog.showErrorBox('Unhandle Promise rejection', JSON.stringify(reason));
      // app.quit();
    });


    app.on('window-all-closed', () => {
      const ret = this.onAppQuit();
      if (ret instanceof Promise) {
        ret.finally(() => {
          globalShortcut.unregisterAll();
          app.quit();
        })
      } else {
        globalShortcut.unregisterAll();
        app.quit();
      }
    })
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      event.preventDefault();
      callback(true);
    });
    app.on('second-instance', () => {
      const windows = BrowserWindow.getAllWindows();
      for (const w of windows) {
        if (w.isVisible()) { w.show(); }
      }
    });
    app.whenReady().then(() => {
      if (!app.commandLine.hasSwitch('mi')) {
        if (!app.requestSingleInstanceLock()) {
          app.quit();
          return;
        }
      }

      Logger.initialize();
      console.info(`--------------------------------------------APP Started ----------------------------------------------------------`);
      console.info(app.getAppPath());
      console.info('argc', process.argv);
      console.info("log to", app.getPath('logs'));
      console.info(process.argv)
      console.info(JSON.stringify(this.getSysInfo()));
      console.info('------------------------------------------------------------------------------------------------------------------');

      if (!app.isPackaged || app.commandLine.hasSwitch('debug')) { //debug
        this.setupDevTool();
      }
      this.onAppStartup();
    });
  }


  private setupDevTool() {
    globalShortcut.register('Ctrl+F12', () => {
      const curWindow = BrowserWindow.getFocusedWindow();
      if (curWindow && !curWindow.webContents.isDevToolsOpened()) {
        curWindow.setResizable(true);
        curWindow.webContents.openDevTools();
      }
    });

    // globalShortcut.register('Left', () => {
    //   const curWindow = BrowserWindow.getFocusedWindow();
    //   curWindow?.webContents.send("click-left");
    // })

    // globalShortcut.register('Right', () => {
    //   const curWindow = BrowserWindow.getFocusedWindow();
    //   curWindow?.webContents.send("click-right");
    // })

    if (!app.isPackaged) {
      try {
        const {
          default: installExtension,
          REACT_DEVELOPER_TOOLS,
          REDUX_DEVTOOLS,
        } = require('electron-devtools-installer');

        installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]).then((name: string) => {
          console.info(`Added Extension:  ${name}`);
        }).catch((err: Error) => {
          console.error('Added React Dev Extension : An error occurred: ', err);
        });
      } catch (err) {
        console.error('failed to install dev tools');
      }
    }
  }

  public run() {
    MessageQueue.registerMessage('show-window', 0, (data: CreateWindowParam) => {
      let parent: BrowserWindow | undefined;
      try {
        parent = BrowserWindow.fromId(data.parentId);
      } catch (err) {
        //ignore console.error(err);
      }
      const win = this.onCreateWindow(data, parent);
      return win ? win.id : 0;
    })
    MessageQueue.registerMessage('runexe', 0, (data: { name: string }) => {
      try {
        const exePath = getResourcePath(data.name);
        const buf = childProcess.execFileSync(exePath);
        const str: string = buf.toString('utf-8');
        return str;
      } catch (e) {
        console.error('error run exe', e);
        return null;
      }
    })
    MessageQueue.registerMessage('getConfig', 0, () => {
      return getAppConfig();
    })
    MessageQueue.registerMessage('hostInfo', 0, () => {
      try {
        const info: any = {};
        info.arch = os.arch();
        return info;
      } catch (e) {
        console.error('error get host Info', e);
        return null;
      }
    })
    MessageQueue.registerMessage('getSysInfo', 0, (data: { name: string }) => {
      try {
        return this.getSysInfo();
      } catch (e) {
        console.error('error get sysinfo', e);
        return {};
      }
    })

    MessageQueue.registerMessage('regGlobalHotKey', 0, (data: { winId?: number; code: string; hotkeys: string; }) => {
      if (!data) {
        return false;
      }
      return HotkeyMgr.registerHotKey(data.code, data.hotkeys, data.winId);
    })
    MessageQueue.registerMessage('unregGlobalHotKey', 0, (data: { code: string; winId?: number }) => {
      HotkeyMgr.unregisterHotKey(data.code, data.winId);
      return true;
    })

    MessageQueue.registerMessage('relaunch', 0, () => {
      try {
        const exePath = getResourcePath('exec.exe');
        const appPath = app.getPath('module');
        const args = [...process.argv]
        args.shift();
        args.unshift(appPath);
        console.info('run ', exePath, args.join(' '));
        app.releaseSingleInstanceLock();
        BrowserWindow.getAllWindows().forEach(w => w.hide());
        BrowserWindow.getAllWindows().forEach(w => w.destroy());
        const cp = childProcess.spawn(exePath, args, { detached: true });
        cp.unref();
      } catch (e) {
        console.error('error run exe', e);
        return null;
      }
      // app.exit(0);
    })

    MessageQueue.registerMessage('open-url', 0, (data: { url: string }) => {
      shell.openExternal(data.url);
    })

    MessageQueue.registerMessage('save-book', 0, (data: { filename: string, content: string }) => {
      return this.bookUtil.setFile(data)
    })

    MessageQueue.registerMessage('get-book', 0, (data: { filename: string }) => {
      return this.bookUtil.getFile(data.filename)
    })

    MessageQueue.registerMessage('delete-book', 0, (data: { filename: string }) => {
      this.bookUtil.deleteFile(data.filename)
    })
  }
  public getSysInfo() {
    if (!App.sysInfo) {
      const sysInfo: any = {
        os: os.type(),
        osVersion: os.version(),
        hostName: os.hostname(),
        free: os.freemem(),
        total: os.totalmem(),
        cpu: os.cpus().length,
        cpuType: os.cpus()[0] && os.cpus()[0].model,
        arch: os.arch(),
        platform: os.platform(),
        release: os.release(),
        user: os.userInfo().username,
      };

      const nets = os.networkInterfaces();
      const results = Object.create(null); // Or just '{}', an empty object

      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }
      sysInfo.net = results;
      App.sysInfo = sysInfo;
    }
    return App.sysInfo;
  }


  protected onCreateWindow(createParam?: CreateWindowParam, parent?: BrowserWindow): BaseWindow | null {
    return null;
  }

  protected onAppQuit(): void | Promise<any> {
  }

  protected onAppStartup() {

  }

}
