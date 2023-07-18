import { request } from "@/request";
import { VersionService } from "@/typings/version";

export function versionList(query: VersionService.IQueryInfo): T_RESPONSE_LIST<VersionService.IListData> {
  return request.get({
    path: '/version/list',
    query,
  })
}

export function versionCreate(data: VersionService.ICreateInfo): T_RESPONSE_BASE<VersionService.IListData> {
  return request.post({
    path: '/version/create',
    data,
  })
}

export function versionEdit(id: string, data: VersionService.ICreateInfo): T_RESPONSE_BASE<VersionService.IListData> {
  return request.put({
    path: `/version/edit/${id}`,
    data,
  })
}

export function versionDelete(id: string): T_RESPONSE_BASE {
  return request.delete({
    path: `/version/delete/${id}`,
  })
}

export function setUsedVersion(id: string): T_RESPONSE_BASE {
  return request.post({
    path: `/version/used/${id}`,
  })
}
