import DataBase from "@/db";
import { CRAWLERS_SQL } from "@/sql";
import { RESPONSE_CODE_MSG, RESPONSE_TYPE } from "@/utils";
import { CrawlersUtil, ICrawlersUtilProps } from "./CrawlersUtil";
import * as fs from 'fs'
import * as path from 'path'
import { Blob } from "buffer";

class CrawlersService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(CRAWLERS_SQL.queryLimitOffset, [_offset, _limit])
    const newData = data?.map((e) => ({ ...e, password: undefined, session: undefined }))
    const allData = await this.all()
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: newData,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async all() {
    const { data } = await DataBase.sql(CRAWLERS_SQL.queryAll)
    return data
  }

  async download(...args) {
    const [req, res] = args;
    const util = new CrawlersUtil(req.body);
    const filePath = await util.init()
    if (filePath) {
      const name = path.basename(filePath)
      const buffer = fs.readFileSync(filePath);
      res.writeHead(200);
      return JSON.stringify({
        buffer: buffer,
        name,
      })
    } else {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.downloadError })
    }
  }
}

const crawlersService = new CrawlersService()

export default crawlersService
