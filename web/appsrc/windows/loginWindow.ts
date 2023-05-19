import BaseWindow from '../baseWindow';
import * as electron from 'electron';
import { Intent } from '../electron-client';

// tslint:disable-next-line: max-classes-per-file
export default class LoginWindow extends BaseWindow {
  private static instance: LoginWindow = null;
  public static create(intent?: Intent) {
    if (!LoginWindow.instance) {
      LoginWindow.instance = new LoginWindow(intent);
    }
    return LoginWindow.instance;
  }

  private constructor(intent?: Intent) {
    super('login', intent, {
      width: 452,
      height: 628,
      resizable: false,
      maximizable: false,
      transparent: true,
      backgroundColor: '#00000000',
    });
  }
  public getLogCategory() {
    return 'Login';
  }
  onClosing() {
    //ovrride super onclosing
  }
  protected async onClosed(e: electron.Event): Promise<void> {
    if (LoginWindow.instance === this) {
      LoginWindow.instance = null;
    }
  }
}
