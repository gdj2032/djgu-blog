import App from './app';
import LoginWindow from './windows/loginWindow';
import HomeWindow from './windows/homeWindow';
import { BrowserWindow } from 'electron';
import BaseWindow from './baseWindow';
import { CreateWindowParam } from './electron-client';

require('@electron/remote/main').initialize();
export default class MyApp extends App {
  onAppStartup() {
    HomeWindow.create();
  }

  public onCreateWindow(data?: CreateWindowParam, parent?: BrowserWindow): BaseWindow | null {
    console.log('🚀 ~ file: main.ts ~ line 15 ~ MyApp ~ onCreateWindow ~ data', data)
    if (data.name === 'home') {
      return HomeWindow.create();
    } else if (data.name === 'login') {
      return LoginWindow.create(data.intent);
    }
    return super.onCreateWindow(data);
  }
  onAppQuit() {
    super.onAppQuit()
  }
}

new MyApp().run();
