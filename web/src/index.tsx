import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './stores/store';
import Roots from '@/framework/routes'
import zhCN from 'antd/lib/locale/zh_CN'
import './index.scss';
import { App, ConfigProvider } from 'antd';
import { PersistGate } from 'redux-persist/integration/react'
import start, { microAction } from '@/micro';

import '@/styles/global.scss';
import { APPNAME } from './constants';
import { Loading } from './components';

// svg配置
// import all svg
const cache = {};
function importAll(r: any) {
  r.keys().forEach((key: any) => {
    // const reg = / fill="(\S*)"/g
    // const s = r(key).default.content.replaceAll(reg, '')
    // r(key).default.content = s;
    // console.info('--- info --->', r(key).default.content);
    (cache as any)[key] = r(key);
  });
}

importAll(require.context('./images/svg', true, /\.svg$/));
// svg end

// 注册微应用并启动
start()

const container = document.getElementById('root')!;
const root = createRoot(container);


const Apps = () => {
  useEffect(() => {
    document.title = APPNAME
    setTimeout(() => {
      microAction.setGlobalState({ info: '主应用发送到子应用的信息' });
    }, 5000);
  }, [])

  return (
    <App>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Roots />
            <Loading ref={c => Loading.setRef(c)} />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </App>
  )
}

root.render(<Apps />);
