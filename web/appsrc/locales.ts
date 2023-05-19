// zh-CN	中文（简体）
// zh-TW	中文（繁体）
// ja
// en

import { app } from 'electron';

const zhCN: any = {
  appTitle: 'DEMO',
  trayPopTitle: '程序已最小化',
  trayPopContent: 'DEMO已最小化到托盘, 单击图标以显示窗口',
  quit: '退出'
};

const zhTW: any = {
};

const ja: any = {
};

const en: any = {
  appTitle: 'DEMO',
  trayPopTitle: 'Programe minimized',
  trayPopContent: 'Click DEMOICON in the tray to show window',
  quit: 'Quit'
};

const locales: any = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  en
};

export function getLocaleString(key: string) {
  const curLoc = app.getLocale();
  for (const k of Object.keys(locales)) {
    if (k.toLocaleLowerCase() === curLoc.toLowerCase()) {
      const locStrings: any = locales[k];
      if (locStrings[key]) {
        return locStrings[key];
      }
      break;
    }
  }
  return locales.en[key] || '';
}
