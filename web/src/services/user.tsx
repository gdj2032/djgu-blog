import { request } from '@/utils';
import { UserService } from '../typings/user';

export function login(params: UserService.ILoginParams): T_RESPONSE_BASE {
  return request.post({
    path: '/user/login/password',
    data: params
  })
}

export function logout(): T_RESPONSE_BASE {
  return request.delete({
    path: '/user/logout',
  })
}
