import { request } from "@/request";
import { TagService } from "@/typings/tag";

// 所有标签 同级
export function dList(query: TagService.IQueryInfo): T_RESPONSE_LIST<TagService.IListData> {
  return request.get({
    path: '/tag/list',
    query,
  })
}

// 分层标签 不同级
export function dListTier(query: TagService.IQueryTierInfo): T_RESPONSE_BASE<TagService.IListData[]> {
  return request.get({
    path: '/tag/list/tier',
    query,
  })
}

export function dDetail(id): T_RESPONSE_BASE<TagService.IListData> {
  return request.get({
    path: `/tag/detail/${id}`,
  })
}

export function dCreate(data: TagService.ICreateInfo): T_RESPONSE_BASE<TagService.IListData> {
  return request.post({
    path: '/tag/create',
    data,
  })
}

export function dEdit(id: string, data: TagService.ICreateInfo): T_RESPONSE_BASE<TagService.IListData> {
  return request.put({
    path: `/tag/edit/${id}`,
    data,
  })
}

export function dDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/tag/delete/${id}`,
  })
}
