import { request } from "@/request";
import { DocumentService } from "@/typings/document";

export function dList(query: ILimitOffset): T_RESPONSE_LIST<DocumentService.IListData> {
  return request.get({
    path: '/document/list',
    query,
  })
}

export function dDetail(id): T_RESPONSE_BASE<DocumentService.IListData> {
  return request.get({
    path: `/document/detail/${id}`,
  })
}

export function dCreate(data: DocumentService.ICreateInfo): T_RESPONSE_BASE<DocumentService.IListData> {
  return request.post({
    path: '/document/create',
    data,
  })
}

export function dEdit(id: string, data: DocumentService.ICreateInfo): T_RESPONSE_BASE<DocumentService.IListData> {
  return request.put({
    path: `/document/edit/${id}`,
    data,
  })
}

export function dDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/document/delete/${id}`,
  })
}
