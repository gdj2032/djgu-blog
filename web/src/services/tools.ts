import { request } from "@/request";

export function data2Interface(data: any): T_RESPONSE_BASE<any> {
  return request.post({
    path: '/tools/data2Interface',
    data: {
      data
    },
  })
}
