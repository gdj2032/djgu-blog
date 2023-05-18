import { message } from 'antd'
import { request } from '@tmind/utils'
import { API_HOST } from '@/constants'
import { ErrorHandler, IRequestOptions } from '@tmind/utils/lib/request'
import { doLogout } from './login'

const onError: ErrorHandler = (options: IRequestOptions, response: any, error: any) => {
  if (!response) {
    return false
  }
  if (response.status === 401) {
    doLogout()
    return true
  } if (response.status >= 500 && response.status <= 599) {
    message.error(`服务器错误: ${response.statusText}`)
    return true
  } if (error.message) {
    message.error(error.message)
    return true
  }
  return false
}

const initRequest = () => {
  request.setDefaultAPIHost(API_HOST)
  request.setDefaultErrorHandler(onError)
}

export {
  initRequest,
  request,
}
