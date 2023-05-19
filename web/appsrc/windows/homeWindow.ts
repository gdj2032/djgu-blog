import BaseWindow from '../baseWindow';
import * as electron from 'electron';
import { Menu, Tray, app } from 'electron';
import { getLocaleString } from '../locales';
import { getResourcePath } from '../utils';


// tslint:disable-next-line:max-classes-per-file
export default class HomeWindow extends BaseWindow {
  private trayIcon: Tray;
  private balloonTimer: NodeJS.Timeout;
  private static instance: HomeWindow = null;
  public static create() {
    if (! HomeWindow.instance) {
      HomeWindow.instance = new HomeWindow();
    }
    return  HomeWindow.instance;
  }
  private constructor() {
    super('', null, {
      // width: 1068,
      // height: 800,
      width: 1280,
      height: 680,
      minWidth: 1024,
      minHeight: 600,
      resizable: true,
    });
  }

  protected init(url: string, options: electron.LoadURLOptions) {
    super.init(url, options);
    // this.createSystemTray();
  }
  public getLogCategory() {
    return 'Home';
  }

  protected async onClosed(e: electron.Event) {
    await super.onClosed(e);
    this.trayIcon && this.trayIcon.destroy();
    if (HomeWindow.instance === this) {
      HomeWindow.instance = null;
    }
  }
  private createSystemTray() {
    this.trayIcon = new Tray(getResourcePath('icon.ico'))
    this.trayIcon.on('click', () => {
      this.hostWnd.show();
    });
    const contextMenu = Menu.buildFromTemplate([
      {
        label: getLocaleString('quit'), click: () => {
          this.hostWnd.destroy();
          app.quit();
        }
      }
    ])

    setTimeout(() => {
      this.trayIcon.setContextMenu(contextMenu)
    }, 100);
  }
}
