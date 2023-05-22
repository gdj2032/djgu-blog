import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, getSession, setSession } from "@/utils";
import moment from "moment";

class UserService {
  async Users(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(USER_SQL.queryLimitOffset, [_offset, _limit])
    const newData = data?.map((e) => ({ ...e, password: undefined, session: undefined }))
    const { data: allData } = await DataBase.sql(USER_SQL.queryAll)
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: newData,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async Login(...args) {
    const [req, res] = args;
    const { username, password } = req.body || {}
    if (!username) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.usernameNotEmpty })
    } else if (!password) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.passwordNotEmpty })
    }
    const { data } = await DataBase.sql(USER_SQL.queryByName, username);
    if (data?.length > 0) {
      if (password !== data[0].password) {
        return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.loginError })
      } else {
        const msg = { ...data[0] };
        delete msg.password;
        const loginTime = moment().valueOf()
        const newSession = getSession({ id: msg.id, username: msg.username, loginTime })
        await setSession({ id: msg.id, session: newSession, loginTime })
        msg.session = newSession;
        res.header('SESSION', newSession)
        return RESPONSE_TYPE.commonSuccess({ res, data: msg })
      }
    } else {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.userNotExist })
    }
  }
}

const userService = new UserService()

export default userService
