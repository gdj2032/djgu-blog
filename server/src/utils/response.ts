import * as core from 'express-serve-static-core';

export const Res_Success1 = (sucData) => {
  const res = {
    code: 200,
    data: sucData,
  }
  return JSON.stringify(res)
}

export const Res_Success2 = (sucData) => {
  return JSON.stringify(sucData)
}

export const Res_Error = (code, message) => {
  const res = {
    code,
    message,
  }
  return JSON.stringify(res)
}

export const RESPONSE_CODE_MSG = {
  success: 200,
  serverError: { status: 500, code: 500, msg: '服务器错误' },
  routeNotCorrelation: { status: 500, code: 501, msg: '服务未关联' },
  sessionOverdue: { status: 401, code: 401, msg: 'session不存在或登录已过期' },
  usernameNotEmpty: { status: 400, code: 1001, msg: '用户名不能为空' },
  passwordNotEmpty: { status: 400, code: 1002, msg: '密码不能为空' },
  loginError: { status: 400, code: 1003, msg: '用户名或密码不正确' },
  userNotExist: { status: 400, code: 1004, msg: '用户不存在' },
  roleNotEmpty: { status: 400, code: 1005, msg: '角色不能为空' },
  usernameExist: { status: 400, code: 1006, msg: '用户名已存在' },
  idNotEmpty: { status: 400, code: 1007, msg: 'id不能为空' },
  nameNotEmpty: { status: 400, code: 1008, msg: '名称不能为空' },
  nameExist: { status: 400, code: 1009, msg: '名称已存在' },
  typeNotExist: { status: 400, code: 1010, msg: '类型不存在' },
  typeNotEmpty: { status: 400, code: 1011, msg: '类型不能为空' },
  contentNotEmpty: { status: 400, code: 1012, msg: '正文不能为空' },
  documentNotExist: { status: 400, code: 1013, msg: '文档不存在' },
  documentInsertError: { status: 400, code: 1014, msg: '新增文档失败' },
  uploadFileError: { status: 400, code: 1015, msg: '文件上传失败' },
  fileNotEmpty: { status: 400, code: 1016, msg: '文件不能为空' },
  fileContentError: { status: 400, code: 1016, msg: '获取文件内容失败' },
}

export const RESPONSE_TYPE = {
  commonSuccess: ({
    res,
    status = RESPONSE_CODE_MSG.success,
    code = RESPONSE_CODE_MSG.success,
    data,
  }: {
    res: core.Response,
    data?: any;
    status?: number;
    code?: number;
  }) => {
    res.writeHead(status);
    return JSON.stringify({ code, data, status });
  },
  commonSuccess2List: ({
    res,
    status = RESPONSE_CODE_MSG.success,
    code = RESPONSE_CODE_MSG.success,
    data,
    limit = 10,
    offset = 0,
    total,
  }: {
    res: core.Response,
    data: any;
    total: number;
    limit: number;
    offset: number;
    status?: number;
    code?: number;
  }) => {
    res.writeHead(status);
    return JSON.stringify({
      code,
      data: { data, limit, offset, total }
    })
  },
  commonError: ({
    res,
    status = RESPONSE_CODE_MSG.serverError.status,
    code = RESPONSE_CODE_MSG.serverError.code,
    msg = RESPONSE_CODE_MSG.serverError.msg,
  }: {
    res: core.Response,
    status: number;
    code: number;
    msg: string;
  }) => {
    console.info('--- RESPONSE_TYPE commonError --->', msg);
    res.writeHead(status);
    return Res_Error(code, msg)
  },
  serverError: (res: core.Response, error?: string) => {
    console.info('--- RESPONSE_TYPE serverError --->', error);
    const { code, status, msg } = RESPONSE_CODE_MSG.serverError
    res.writeHead(status);
    return Res_Error(code, msg)
  },
  commonErrors: async (info: {
    res: core.Response;
    errs: {
      // 判断条件
      func: () => Promise<boolean> | boolean;
      status: number;
      code: number;
      msg: string;
    }[]
  }) => {
    const { res, errs } = info
    let errorAble;
    for (const err of errs) {
      const { func, ...arg } = err;
      const bool = await func?.()
      if (bool) {
        errorAble = RESPONSE_TYPE.commonError({ res, ...arg })
        break;
      }
    }
    return errorAble;
  }
}
