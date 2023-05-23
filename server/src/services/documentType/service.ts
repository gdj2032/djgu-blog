import { DOCUMENT_TYPE_SQL } from './../../sql/documentType';
import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE, documentTypeUuid, getUserIdNameBySession, RESPONSE_CODE_MSG } from "@/utils";
import userService from '../user/service';
import moment from 'moment';

class DocumentTypeService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(DOCUMENT_TYPE_SQL.queryLimitOffset, [_offset, _limit])
    const allUsers = (await userService.allUsers()).map((e) => ({ id: e.id, name: e.username, role: e.role }))
    const newData = data?.map((e) => ({ ...e, user: allUsers.find(v => v.id === e.userId), userId: undefined }))
    const { data: allData } = await DataBase.sql(USER_SQL.queryAll)
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: newData,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async create(...args) {
    const [req, res] = args;
    const { name, description, imageUrl } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
      ]
    })
    if (errorAble) return errorAble;
    const reqSession = req.headers?.session as string;
    const userInfo = getUserIdNameBySession(reqSession)
    const tId = documentTypeUuid()
    const time = moment().valueOf();
    await DataBase.sql(DOCUMENT_TYPE_SQL.insert, [tId, name, description, time, time, userInfo.id, imageUrl])
    const { data } = await DataBase.sql(DOCUMENT_TYPE_SQL.queryByName, [name]);
    const allUsers = (await userService.allUsers()).map((e) => ({ id: e.id, name: e.username, role: e.role }))
    const newData = {
      ...data[0],
      userId: undefined,
      user: allUsers.find(v => v.id === data[0].userId)
    }
    return RESPONSE_TYPE.commonSuccess({
      res, data: newData,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, imageUrl } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
      ]
    })
    if (errorAble) return errorAble;
    const time = moment().valueOf();
    await DataBase.sql(DOCUMENT_TYPE_SQL.update, [{ name, description, imageUrl, updateTime: time }, id])
    const { data } = await DataBase.sql(DOCUMENT_TYPE_SQL.queryById, [id]);
    const allUsers = (await userService.allUsers()).map((e) => ({ id: e.id, name: e.username, role: e.role }))
    const newData = {
      ...data[0],
      userId: undefined,
      user: allUsers.find(v => v.id === data[0].userId)
    }
    return RESPONSE_TYPE.commonSuccess({
      res, data: newData,
    })
  }

  async delete(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
      ]
    })
    if (errorAble) return errorAble;
    const { error, data } = await DataBase.sql(DOCUMENT_TYPE_SQL.deleteById, [id])
    console.log("🚀 ~ file: service.ts:90 ~ DocumentTypeService ~ delete ~ error, data:", error, data)
    if (!error) {
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }
}

const documentTypeService = new DocumentTypeService()

export default documentTypeService
