import App from "@/app"
import { Methods } from "@/typings/method"
import { RequestMapping } from './mapping'

const mApp = App.instance.app

/**
 * 控制器路由的方法装饰器
 * @param path
 * @returns
 */
export const Get = (path: string): MethodDecorator => {
  return (target, key, { value }) => {
    /**
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
        mApp.get(mUrl, async (req, res) => {
          // res.writeHead(200)
          const mData = await mFun(req, res)
          if (typeof mData === 'string') {
            res.write(mData)
          } else {
            res.write(JSON.stringify(mData))
          }
          res.end();
        })
        clearInterval(mTime)
      }
    }, 5)
  }
}

export const Post = (path: string): MethodDecorator => {
  return (target, key, { value }) => {
    const mFun = value as unknown as Methods.Post
    const mProto = target.constructor.prototype
    const mTime = setInterval(() => {
      if (mProto.url) {
        const mUrl = mProto.url + path
        mApp.post(mUrl, async (req, res) => {
          const mData = await mFun(req, res)
          if (typeof mData === 'string') {
            res.write(mData)
          } else {
            res.write(JSON.stringify(mData))
          }
          res.end();
        })
        clearInterval(mTime)
      }
    }, 5)
  }
}

export const Put = (path: string): MethodDecorator => {
  return (target, key, { value }) => {
    const mFun = value as unknown as Methods.Put
    const mProto = target.constructor.prototype
    const mTime = setInterval(() => {
      if (mProto.url) {
        const mUrl = mProto.url + path
        mApp.put(mUrl, async (req, res) => {
          const mData = await mFun(req, res)
          if (typeof mData === 'string') {
            res.write(mData)
          } else {
            res.write(JSON.stringify(mData))
          }
          res.end();
        })
        clearInterval(mTime)
      }
    }, 5)
  }
}
export const Delete = (path: string): MethodDecorator => {
  return (target, key, { value }) => {
    const mFun = value as unknown as Methods.Delete
    const mProto = target.constructor.prototype
    const mTime = setInterval(() => {
      if (mProto.url) {
        const mUrl = mProto.url + path
        mApp.delete(mUrl, async (req, res) => {
          const mData = await mFun(req, res)
          if (typeof mData === 'string') {
            res.write(mData)
          } else {
            res.write(JSON.stringify(mData))
          }
          res.end();
        })
        clearInterval(mTime)
      }
    }, 5)
  }
}

export {
  RequestMapping,
}
