import { request } from '@/request';
import { UserService } from '../typings/user';
import { IUserState } from '@/stores/user';

export function login(params: UserService.ILoginParams): T_RESPONSE_BASE<IUserState> {
  return request.post({
    path: '/user/login',
    data: params
  })
}

export function logout(): T_RESPONSE_BASE {
  return request.delete({
    path: '/user/logout',
  })
}


export function users(query: ILimitOffset): T_RESPONSE_LIST<UserService.IListData> {
  return request.get({
    path: '/user',
    query,
  })
}
