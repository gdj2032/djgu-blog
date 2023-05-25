import { request } from '@/request';

export function upload(data: FormData): T_RESPONSE_BASE<{ url: string }> {
  return request.upload({
    path: '/file/upload',
    data
  })
}
