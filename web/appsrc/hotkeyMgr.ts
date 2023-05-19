import { BrowserWindow, globalShortcut } from 'electron';

declare type HotKeyDst = {
  code: string;
  winId?: number;
}

class HotKeyManager {

  private curHotKeys: Map<string, HotKeyDst[]> = new Map();

  public registerHotKey(code: string, hotkey: string, winId?: number) {
    if (!hotkey) {
      this.unregisterHotKey(code, winId);
      return true;
    }
    winId = winId || null;//统一成null,便于比较
    hotkey = this.fixKey(hotkey);
    this.unregisterHotKey(code, winId);
    let ret = true;
    hotkey = hotkey.toUpperCase();
    if (!this.curHotKeys.has(hotkey)) {
      this.curHotKeys.set(hotkey, []);
      ret = globalShortcut.register(hotkey, () => {
        this.handleHotKey(hotkey);
      });
    }
    const entry = this.curHotKeys.get(hotkey);
    entry.unshift({ code, winId });
    return ret;
  }

  public unregisterHotKey(code: string, winId?: number) {
    winId = winId || null;//统一成null,便于比较
    //找到code所在数组，移除, 如果全部空，则取消快捷键
    for (const k of this.curHotKeys.keys()) {
      const entry = this.curHotKeys.get(k);
      for (let i = entry.length - 1; i >= 0; i--) {
        if (entry[i].code === code && entry[i].winId === winId) {
          entry.splice(i, 1);
        }
      }
      if (entry.length === 0) {
        this.curHotKeys.delete(k);
        globalShortcut.unregister(k);
      }
    }
  }

  public unregisterHotKeyForWindow(winId: number) {
    if (!winId) {
      return;
    }
    for (const k of this.curHotKeys.keys()) {
      const entry = this.curHotKeys.get(k);
      for (let i = entry.length - 1; i >= 0; i--) {
        if (entry[i].winId === winId) {
          entry.splice(i, 1);
        }
      }
      if (entry.length === 0) {
        this.curHotKeys.delete(k);
        globalShortcut.unregister(k);
      }
    }
  }

  private fixKey(hotkey: string) {
    const keys = hotkey.toUpperCase().split('+');
    hotkey = keys.sort().join('+');
    return hotkey;
  }
  private handleHotKey(hotkey: string) {
    if (!this.curHotKeys.has(hotkey)) {
      return;
    }
    const entry = this.curHotKeys.get(hotkey);
    if (entry.length === 0) {
      return;
    }
    const dst = entry[0];
    const windows = dst.winId ? [BrowserWindow.fromId(dst.winId)] : BrowserWindow.getAllWindows();
    for (const w of windows) {
      w.webContents.send('hotkeyClicked', { code: dst.code });
    }
  }
}

const instance = new HotKeyManager();
export default instance;
