import { API_HOST, Credentials, isElectron } from '@/constants';
import { genQuery, abortablePromise } from './helper';
import { message } from 'antd';
import { store } from '@/stores';
import { doLogout, initRoutes } from '@/utils';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

function checkStatus(response: any, download?: boolean) {
  switch (response.status) {
    case 200:
      if (download) {
        return response.blob().then((blob: Blob) => {
          return Promise.resolve(blob);
        });
      }
      return response.text().then((text: string) => {
        const r = text ? JSON.parse(text) : {}
        console.log("🚀 ~ returnresponse.text ~ r:", r)
        if (r.code !== 200 && r.message) {
          message.error(r.message)
        }
        return Promise.resolve(r)
      });
    case 401:
      doLogout({ tip: '登录已失效', type: 'error' });
      initRoutes()
      break;
    default:
      return (response.json()).then((json: any) => {
        if (json.message) {
          message.error(json.message)
        }
        return Promise.reject(json);
      });
  }
}

function fetchRequest(options: IRequestOptions) {
  if (!options.method || methods.indexOf(options.method) === -1) {
    return Promise.reject('请求类型错误');
  }

  const requestUrl = `${options.url || API_HOST}${options.path}${genQuery(options.query)}`;

  const config: any = {
    method: options.method,
    credentials: options.credentials || Credentials,
    headers: {
      ...options.headers,
      ele: isElectron,
      session: store.getState()?.user?.session,
    }
  };

  // application/json
  if (options.headers && options.headers['Content-Type'] === 'application/json') {
    config.body = JSON.stringify(options.data);
  }

  // application/x-www-form-urlencoded
  if (options.headers && options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const searchParams = Object.keys(options.data).map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(options.data[key])}`;
    }).join('&');
    config.body = searchParams;
  }

  if (options.upload) {
    if (options.data instanceof FormData) {
      config.body = options.data;
    } else {
      console.error('上传服务中，data必须是FormData')
      return;
    }
  }

  return abortablePromise(fetch(requestUrl, config), options.timeout)
    .then(response => checkStatus(response, options.download));
}

const request = {
  get: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
  },
  post: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  },
  postForm: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  delete: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    })
  },
  put: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  },
  upload: (opts: IRequestOptions) => {
    return fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      upload: true
    })
  }
};

export default request;
