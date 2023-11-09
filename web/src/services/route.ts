import { request } from "@/request";
import { RouteService } from "@/typings/route";

export function dList(query: RouteService.IQueryInfo): T_RESPONSE_LIST<RouteService.IListData> {
  return request.get({
    path: '/route/list',
    query,
  })
}

export function dDetail(id): T_RESPONSE_BASE<RouteService.IListData> {
  return request.get({
    path: `/route/detail/${id}`,
  })
}

export function dCreate(data: RouteService.ICreateInfo): T_RESPONSE_BASE<RouteService.IListData> {
  return request.post({
    path: '/route/create',
    data,
  })
}

export function dEdit(id: string, data: RouteService.ICreateInfo): T_RESPONSE_BASE<RouteService.IListData> {
  return request.put({
    path: `/route/edit/${id}`,
    data,
  })
}

export function dDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/route/delete/${id}`,
  })
}
