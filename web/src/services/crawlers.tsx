import { request } from '@/request';
import { CrawlersService } from '../typings/crawlers';

export function list(query: ILimitOffset): T_RESPONSE_LIST<CrawlersService.IListData> {
  return request.get({
    path: '/crawlers/list',
    query,
  })
}

export function download(data: CrawlersService.IDownloadInfo): Promise<{
  buffer: any,
  name: string,
}> {
  return request.post({
    path: '/crawlers/download',
    data,
  })
}
