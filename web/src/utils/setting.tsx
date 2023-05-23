import * as ls from 'local-storage';
import { EventEmitter } from 'events';

// import randomString from 'random-string'; // 获取随机字符串
import { isElectron } from '@/constants';

export const ALL_FPS = [1, 3, 5, 10, 15, 20];
export const ALL_SAMPLERATE = [8000, 16000, 44100, 48000];

export enum SettingKey {
  username = 'username', // 用户名
  password = 'password', // 记住密码
  session = 'session',
}

class Settings extends EventEmitter {
  private tempSettings: Set<SettingKey> = new Set();
  private memSetings: Map<SettingKey, any> = new Map();

  constructor() {
    super();
    this.setMaxListeners(1000);
    for (const key in SettingKey) {
      if (key) {
        this.memSetings.set(key as SettingKey, this[key]);
      }
    }
  }
  initialize() {
    this.memSetings = new Map();
  }

  public isTempSetting(key: SettingKey) {
    return this.tempSettings.has(key);
  }

  private saveSetting(key: SettingKey, newSetting: any) {
    let notify = false;
    //比较新旧的Setting
    //数组，比较每一项的值
    //对象，比较每一个key的值
    //其他，比较值
    const oldSetting = this[key as string];
    if (oldSetting === undefined || oldSetting === null || newSetting === undefined || newSetting === null) {
      if (oldSetting !== newSetting) {
        notify = true;
      }
    } else if (Array.isArray(oldSetting)) {
      if (oldSetting.length !== newSetting.length) {
        notify = true;
      }
      for (let i = 0; i < oldSetting.length; i++) {
        if (oldSetting[i] !== newSetting[i]) {
          notify = true;
        }
      }
    } else if (typeof oldSetting === 'object') {
      const oldKeys = Object.keys(oldSetting);
      const newKeys = Object.keys(newSetting);
      if (oldKeys.length !== newKeys.length) {
        notify = true;
      }
      for (const k of Object.keys(oldSetting)) {
        if (oldSetting[k] !== newSetting[k]) {
          notify = true;
        }
      }
    } else {
      notify = oldSetting !== newSetting;
    }
    this.memSetings.set(key, newSetting);

    if (!this.tempSettings.has(key)) {
      ls.set(key, newSetting);
      this.flush();
    }

    if (notify) {
      this.emit(key, newSetting, oldSetting);
    }
  }

  private loadSetting(key: SettingKey, cbPostLoad?: (v: any) => any) {
    if (!this.memSetings.has(key)) {
      let lsValue = ls.get(key);
      if (cbPostLoad) {
        lsValue = cbPostLoad(lsValue);
      }
      this.memSetings.set(key, lsValue);
    }
    const setting = this.memSetings.get(key);
    if (setting === null || undefined) {
      return setting;
    } else if (Array.isArray(setting)) {
      return [...setting];
    } else if (typeof setting === 'object') {
      return { ...setting };
    } else {
      return setting;
    }
  }

  private flush() {
    if (isElectron) {
      window.app.flushStorage();
    }
  }

  public set username(name: string) {
    this.saveSetting(SettingKey.username, name);
  }

  public get username(): string {
    return this.loadSetting(SettingKey.username);
  }

  public set password(pass: string) {
    this.saveSetting(SettingKey.password, pass);
  }

  public get password(): string {
    return this.loadSetting(SettingKey.password);
  }

  public set session(str: string) {
    this.saveSetting(SettingKey.session, str);
  }

  public get session(): string {
    return this.loadSetting(SettingKey.session);
  }
}

const Setting = new Settings();
export default Setting;
