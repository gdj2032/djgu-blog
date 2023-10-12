import App from "@/app"
import { Methods } from "@/typings/method"
import * as core from 'express-serve-static-core';
import { RequestMapping } from './mapping'
import { getUserIdNameBySession, RESPONSE_TYPE, RESPONSE_CODE_MSG } from "@/utils";
import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import moment from "moment";
import { SESSION_TIME } from "@/constants";
// import multer from 'multer'

const mApp = App.instance.app

const allowSession = 'session可用'

// const headerConfig = multer.diskStorage({
//   // destination 上传目的地文件夹 （必需）
//   destination: (req, file, callback) => {
//     // FILE_PATH 为目录绝对路径(用户选择目录的绝对路径)
//     callback(null, FILE_PATH)
//   },
//   // 拿到所上传文件的 filename处理，我是处理成原来的名称（可以打印出 file 的各个属性看看）
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   }
// })
// const uploadConfig = multer({
//   // storage: headerConfig,
//   // dest: FILE_PATH,
// })

export const CheckSession = async (req: core.Request, res: core.Response) => new Promise<string>(async (resolve, reject) => {
  const reqSession = req.headers?.session as string;
  if (reqSession) {
    const userInfo = getUserIdNameBySession(reqSession);
    if (userInfo?.id) {
      const { data } = await DataBase.sql(USER_SQL.queryById, [userInfo.id])
      if (data.length > 0) {
        const { session, loginTime } = data[0]
        const cueTimer = moment().valueOf()
        const canUse = (cueTimer - (+loginTime)) < SESSION_TIME
        if (reqSession === session && canUse) {
          console.info('--- session 可用 ---');
          resolve(allowSession)
          return;
        }
      }
    } else {
      reject(RESPONSE_TYPE.serverError(res, 'checkSession'))
      return;
    }
  }
  reject(RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.sessionOverdue }))
})

const check = async (req: core.Request, res: core.Response) => {
  let allow;
  try {
    await CheckSession(req, res);
  } catch (error) {
    console.log("🚀 ~ CheckSession error:", error)
    allow = error;
  }
  return allow
}

const common = async ({ value, target, path, sessionAble, method, uploadType }: {
  value: any,
  target: any,
  path: string;
  sessionAble?: boolean;
  method: 'get' | 'post' | 'delete' | 'put' | 'patch',
  uploadType?: 'file' | 'directory';
}) => {
  /*
  **
     * 目标方法，只需要拿到返回内容即可，可以直接运行这个方法
     * 而这个类型断言为了类型规范，其实可直接定义any
     */
  const mFun = value as unknown as Methods.Get
  // 拿到装饰器工厂的原型链
  const mProto = target.constructor.prototype
  /**
   * 这里的定时器由于装饰器的执行顺序是不一样的
   * 类装饰器工厂是最后一个执行的
   * 所以在我们执行这个方法装饰器的时候
   * 类装饰器还没有写入原型链中的url
   * 所以我们需要写一个东西来等待获取到这个url
   * 应该还有更好的写法
   */
  const mTime = setInterval(() => {
    if (mProto.url) {
      // 拿到url，拼接上之后直接放到express之中即可
      const mUrl = mProto.url + (path === '/' ? '' : path)
      console.info('--- common url --->', mUrl);

      const appFunc = async (req, res) => {
        if (sessionAble) {
          const sessionRes = await check(req, res);
          if (sessionRes) {
            res.write(sessionRes)
            res.end();
            return;
          }
        }
        const mData: any = await mFun(req, res)
        if (mData?.returns) return;
        if (typeof mData === 'string') {
          res.write(mData)
        } else {
          res.write(JSON.stringify(mData))
        }
        res.end();
      }
      // if (uploadType) {
      //   mApp[method](mUrl, uploadType === 'file' ? uploadConfig.single('file') : uploadConfig.array('file', null), appFunc)
      // } else {
      //   mApp[method](mUrl, appFunc)
      // }
      mApp[method](mUrl, appFunc)
      clearInterval(mTime)
    }
  }, 5)
}

/**
 * 控制器路由的方法装饰器
 * @param path
 * @returns
 */
export const Get = (path: string, sessionAble?: boolean): MethodDecorator => {
  return (target, key, { value }) => {
    common({ target, value, path, sessionAble, method: 'get' })
  }
}

export const Post = (path: string, sessionAble?: boolean): MethodDecorator => {
  return (target, key, { value }) => {
    common({ target, value, path, sessionAble, method: 'post' })
  }
}

export const Put = (path: string, sessionAble?: boolean): MethodDecorator => {
  return (target, key, { value }) => {
    common({ target, value, path, sessionAble, method: 'put' })
  }
}

export const Delete = (path: string, sessionAble?: boolean): MethodDecorator => {
  return (target, key, { value }) => {
    common({ target, value, path, sessionAble, method: 'delete' })
  }
}

export const Patch = (path: string, sessionAble?: boolean): MethodDecorator => {
  return (target, key, { value }) => {
    common({ target, value, path, sessionAble, method: 'patch' })
  }
}

// export const UploadFile = (path: string, sessionAble?: boolean): MethodDecorator => {
//   return (target, key, { value }) => {
//     common({ target, value, path, sessionAble, method: 'post', uploadType: 'file' })
//   }
// }

// export const UploadDirectory = (path: string, sessionAble?: boolean): MethodDecorator => {
//   return (target, key, { value }) => {
//     common({ target, value, path, sessionAble, method: 'post', uploadType: 'directory' })
//   }
// }


export {
  RequestMapping,
}
