import * as core from 'express-serve-static-core';

interface ILimitOffset {
  limit: number;
  offset: number;
}

interface ILimitOffsetTotal extends ILimitOffset {
  total: number;
}

interface IServiceParam0 {
  req: core.Request;
  res: core.Response;
  resKey: string
}


interface IServiceParams {
  req: core.Request;
  res: core.Response;
  resKey: string
}

interface Window {
  global: {
    resKey: {
      [key: string]: core.Response;
    };
  }
}

interface IIdName<T = string> {
  id: T;
  name: string;
}
