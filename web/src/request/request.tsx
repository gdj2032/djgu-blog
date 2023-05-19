import { API_HOST, Credentials, isElectron } from '@/constants';
import to from 'await-to-js';
import { genQuery, abortablePromise } from './helper';
// import { userAction } from '@/actions';
// import { store } from '@/stores/store';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

function checkStatus(response: any, error: (error: any) => void = () => { }) {
  switch (response.status) {
    case 200:
      return response.text().then((text: string) => Promise.resolve(text ? JSON.parse(text) : {}));
    case 401:
      // store.dispatch(userAction.logout() as any)
      break;
    default:
      return (response.json()).then((json: any) => {
        if (json.message) {
          error(json.message);
        } else {
          error(json);
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

  return abortablePromise(fetch(requestUrl, config))
    .then(response => checkStatus(response));
}

const request = {
  get: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }));
  },
  post: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }));
  },
  postForm: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }));
  },
  delete: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    }));
  },
  put: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }));
  },
  upload: (opts: IRequestOptions) => {
    return to(fetchRequest({
      ...opts,
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      upload: true
    }))
  }
};

export default request;
