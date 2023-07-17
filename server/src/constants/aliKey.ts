// 访问域名和数据中心
// https://help.aliyun.com/document_detail/31837.html?spm=5176.doc32070.2.6.LI3ooG

import { isDev } from "./api";

export const ALI_KEY = {
  // ACCESSKEY_ID: 'LTAI5tBkKY2ub4sgzGHjNc3B',
  // ACCESSKEY_SECRET: 'hPQoKQLUWwbC9BZwQNwV3k4Nq42bqC',
  ACCESSKEY_ID: 'LTAI5tSQjRQh6RNCko5srXVU',
  ACCESSKEY_SECRET: 'wKHTzURF8sm1uOOEgoEWOYIvG5JeOH',
  BUCKET_NAME: 'gdj-knowledge-client',
  BUCKET_FILE_NAME: isDev ? 'dev' : 'prod',
  ENDPOINT: 'gdj-knowledge-client.oss-cn-hangzhou.aliyuncs.com',
  REGION: 'oss-cn-hangzhou',
}
