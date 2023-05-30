import { request } from '@/request';

export function upload(data: FormData): T_RESPONSE_BASE<{ id: string, url: string }> {
  return request.upload({
    path: '/file/upload',
    data
  })
}

export function getFile(id: string): Blob {
  return request.get({
    path: `/file/${id}`,
    download: true,
    headers: {
      responseType: 'blob',
    }
  }) as any
}
