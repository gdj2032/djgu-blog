import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE } from "@/utils";

class UserService {
  async Users(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    console.info('--- req.query --->', req.query);
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(USER_SQL.queryLimitOffset, [_offset, _limit])
    console.log("🚀 ~ file: service.ts:13 ~ UserService ~ Users ~ data:", data)
    const { data: allData } = await DataBase.sql(USER_SQL.queryAll)
    return RESPONSE_TYPE.commonSuccess2List({
      res, data,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }
}

const userService = new UserService()

export default userService
