import { request } from "@/request";
import { DocumentTypeService } from "@/typings/documentType";

export function dtList(query: ILimitOffset): T_RESPONSE_LIST<DocumentTypeService.IListData> {
  return request.get({
    path: '/document/type/list',
    query,
  })
}

export function dtCreate(data: DocumentTypeService.ICreateInfo): T_RESPONSE_BASE<DocumentTypeService.IListData> {
  return request.post({
    path: '/document/type/create',
    data,
  })
}

export function dtEdit(id: string, data: DocumentTypeService.ICreateInfo): T_RESPONSE_BASE<DocumentTypeService.IListData> {
  return request.put({
    path: `/document/type/edit/${id}`,
    data,
  })
}

export function dtDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/document/type/delete/${id}`,
  })
}
