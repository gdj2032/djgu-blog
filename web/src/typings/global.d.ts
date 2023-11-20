// 全局类型定义
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __YUNA_MAIN_BASENAME__?: string;
}

// css module
declare module '*.css' {
  const obj: { [key: string]: string }
  export default obj
}

declare module '*.scss' {
  const obj: { [key: string]: string }
  export default obj
}

interface IRequestParams {
  [key: string]: any;
}

interface IRequestOptions {
  path: string;
  method?: string;
  url?: string;
  credentials?: 'same-origin' | 'include';
  query?: IRequestParams;
  data?: IRequestParams;
  headers?: any;
  upload?: boolean;
  download?: boolean;
  timeout?: number;
  responseType?: string;
}

interface menuOption {
  label: string;
  route: string;
  permissions?: number[];
  children?: menuOption[];
  icon?: string;
}

interface Common {
  id: string | number;
  name: string;
}

interface String {
  locales: Function;
  localeString: Function;
  localesDate: Function;
  localesTime: Function;
}

interface ILimitOffset {
  offset: number;
  limit: number;
}

interface IPageInfo extends ILimitOffset {
  total: number;
}

type str_num = string | number;

interface ICodeMsg {
  code: str_num;
  message: string;
  warnings?: string[];
}

interface IBaseRes<T = null> extends ICodeMsg {
  data: T;
}

interface IBaseListData<T = null> extends IPageInfo {
  data: T[];
}

interface IBaseListRes<T> extends ICodeMsg {
  data: IBaseListData<T>;
}

interface IBaseListData2<T = null> extends IPageInfo {
  list: T;
}

interface IBaseListRes2<T> extends ICodeMsg {
  data: IBaseListData2<T>;
}

type T_RESPONSE_BASE<T = null> = Promise<IBaseRes<T>>
type T_RESPONSE_DATA<T = null> = Promise<IBaseListData<T>>
type T_RESPONSE_LIST<T = null> = Promise<IBaseListRes<T>>
type T_RESPONSE_LIST2<T = null> = Promise<IBaseListRes2<T>>

interface IIdName<T = string> {
  id: T;
  name: string;
}

interface IIdNamePath<T = string> extends IIdName<T> {
  path: string;
}
