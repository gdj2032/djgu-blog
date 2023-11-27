import { fileService, routeService } from "@/services";
import { store, routeAction } from "@/stores";
import { DEFAULT_ROUTE_OPTION } from "@/constants";
import dayjs from "dayjs";

export const noop = () => { }

export const nextTick = (func: (value: void) => void): Promise<void> => Promise.resolve().then(func);

// 获取url路径参数
export const getQueryOption = (url: string) => {
  const opt: any = {}
  if (!!url) {
    const qStr = decodeURIComponent(url);
    const parLen = qStr.indexOf('?');
    const parStr = qStr.substring(parLen + 1);
    const parArr = parStr.split('&');
    const params: any[] = []
    // tslint:disable-next-line: forin
    for (const i in parArr) {
      params.push(parArr[i].split('='))
    }
    // tslint:disable-next-line: forin
    for (const j in params) {
      opt[params[j][0]] = params[j][1]
    }
  }
  // console.log('getQueryOption opt =', opt);
  return opt;
}

export const fileUuid = () => {
  const time1 = dayjs().valueOf().toString()
  return time1;
}

export const uploadFile = async ({ content }) => {
  const formData = new FormData()
  formData.append('file', `${fileUuid()}.txt`)
  formData.append('content', content);
  formData.append('type', 'content');
  const res = await fileService.upload(formData);
  return res
}


export const initRoutes = async () => {
  const res = await routeService.dList({ limit: 10000, offset: 0 })
  store.dispatch(routeAction.setRouteInfo({ routes: [...DEFAULT_ROUTE_OPTION.routes, ...res.data.data], currentRoute: res.data.data?.[0] }))
}
