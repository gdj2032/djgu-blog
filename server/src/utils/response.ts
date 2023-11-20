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

// 服务器 500+
// 用户名密码 1001~
// 版本 1101~
// 文件 1201~
// 文档 1301~
// 路由 1401~
// 标签 1501~
// 通用 5001~

export const RESPONSE_CODE_MSG = {
  success: 200,
  serverError: { status: 500, code: 500, msg: '服务器错误' },
  routeNotCorrelation: { status: 500, code: 501, msg: '服务未关联' },
  sessionOverdue: { status: 401, code: 401, msg: 'session不存在或登录已过期' },

  // 通用
  idNotEmpty: { status: 400, code: 5101, msg: 'id不能为空' },
  nameExist: { status: 400, code: 5102, msg: '名称已存在' },
  nameNotEmpty: { status: 400, code: 5103, msg: '名称不能为空' },
  contentNotEmpty: { status: 400, code: 5004, msg: '内容不能为空' },

  // 用户名密码
  usernameNotEmpty: { status: 400, code: 1001, msg: '用户名不能为空' },
  passwordNotEmpty: { status: 400, code: 1002, msg: '密码不能为空' },
  loginError: { status: 400, code: 1003, msg: '用户名或密码不正确' },
  userNotExist: { status: 400, code: 1004, msg: '用户不存在' },
  roleNotEmpty: { status: 400, code: 1005, msg: '角色不能为空' },
  usernameExist: { status: 400, code: 1006, msg: '用户名已存在' },

  // 版本
  versionTypeNotEmpty: { status: 400, code: 1101, msg: '版本类型不能为空' },
  versionNotExist: { status: 400, code: 1102, msg: '版本不存在' },
  versionIsUsed: { status: 400, code: 1103, msg: '该版本正在被使用,无法删除' },

  // 文件
  uploadFileError: { status: 400, code: 1201, msg: '文件上传失败' },
  fileNotEmpty: { status: 400, code: 1202, msg: '文件不能为空' },
  fileContentError: { status: 400, code: 1203, msg: '获取文件内容失败' },
  downloadError: { status: 400, code: 1204, msg: '文件下载失败,请联系管理员' },

  // 文档
  documentNotExist: { status: 400, code: 1301, msg: '文档不存在' },
  documentInsertError: { status: 400, code: 1302, msg: '新增文档失败' },

  // 路由
  pathNotEmpty: { status: 400, code: 1401, msg: '路径不能为空' },
  routeInsertError: { status: 400, code: 1402, msg: '新增路由失败' },
  routeUsedNotDelete: { status: 400, code: 1403, msg: '路由已使用,无法删除' },
  routeNotExist: { status: 400, code: 1404, msg: '路由不存在' },
  pathExist: { status: 400, code: 1405, msg: '路径已存在' },
  routeIdNotEmpty: { status: 400, code: 1406, msg: 'routeId不能为空' },

  // 标签
  tagNotExist: { status: 400, code: 1501, msg: '标签不存在' },
  tagInsertError: { status: 400, code: 1502, msg: '新增标签失败' },
  tagNotEmpty: { status: 400, code: 1503, msg: '标签不能为空' },
  tagUsedNotDelete: { status: 400, code: 1503, msg: '标签已使用, 无法删除' },

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
