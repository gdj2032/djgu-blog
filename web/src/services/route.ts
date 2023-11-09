import { request } from "@/request";
import { RouteService } from "@/typings/route";

export function dList(query: RouteService.IQueryInfo): T_RESPONSE_LIST<RouteService.IListData> {
  return request.get({
    path: '/tabRoute/list',
    query,
  })
}

export function dDetail(id): T_RESPONSE_BASE<RouteService.IListData> {
  return request.get({
    path: `/tabRoute/detail/${id}`,
  })
}

export function dCreate(data: RouteService.ICreateInfo): T_RESPONSE_BASE<RouteService.IListData> {
  return request.post({
    path: '/tabRoute/create',
    data,
  })
}

export function dEdit(id: string, data: RouteService.ICreateInfo): T_RESPONSE_BASE<RouteService.IListData> {
  return request.put({
    path: `/tabRoute/edit/${id}`,
    data,
  })
}

export function dDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/tabRoute/delete/${id}`,
  })
}
