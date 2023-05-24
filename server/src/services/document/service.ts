import { documentUuid } from './../../utils/util';
import DataBase from "@/db";
import { DOCUMENT_SQL, USER_SQL } from "@/sql";
import { RESPONSE_TYPE, getUserIdNameBySession, RESPONSE_CODE_MSG } from "@/utils";
import userService from '../user/service';
import moment from 'moment';

class DocumentService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name, types } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { error, data } = await DataBase.sql(DOCUMENT_SQL.queryLimitOffset, [_offset, _limit, name])
    console.log("🚀 ~ file: service.ts:15 ~ DocumentService ~ list ~ error, data:", error, data)
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
    const { name, description, content, types } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !content, ...RESPONSE_CODE_MSG.contentNotEmpty },
        { func: () => !types?.length, ...RESPONSE_CODE_MSG.typeNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(DOCUMENT_SQL.queryByName, [name])
            if (d1?.length) {
              return true;
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.nameExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const dId = documentUuid()
    const time = moment().valueOf();
    await DataBase.sql(DOCUMENT_SQL.insert, [dId, name, description, content, JSON.stringify(types), time, time])
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [dId]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  // async edit(...args) {
  //   const [req, res] = args;
  //   const { id } = req.params;
  //   const { name, description, imageUrl } = req.body as any;
  //   const errorAble = await RESPONSE_TYPE.commonErrors({
  //     res,
  //     errs: [
  //       { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
  //       { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
  //     ]
  //   })
  //   if (errorAble) return errorAble;
  //   const time = moment().valueOf();
  //   await DataBase.sql(DOCUMENT_TYPE_SQL.update, [{ name, description, imageUrl, updateTime: time }, id])
  //   const { data } = await DataBase.sql(DOCUMENT_TYPE_SQL.queryById, [id]);
  //   const allUsers = (await userService.allUsers()).map((e) => ({ id: e.id, name: e.username, role: e.role }))
  //   const newData = {
  //     ...data[0],
  //     userId: undefined,
  //     user: allUsers.find(v => v.id === data[0].userId)
  //   }
  //   return RESPONSE_TYPE.commonSuccess({
  //     res, data: newData,
  //   })
  // }

  // async delete(...args) {
  //   const [req, res] = args;
  //   const { id } = req.params;
  //   const errorAble = await RESPONSE_TYPE.commonErrors({
  //     res,
  //     errs: [
  //       { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
  //     ]
  //   })
  //   if (errorAble) return errorAble;
  //   const { error, data } = await DataBase.sql(DOCUMENT_TYPE_SQL.deleteById, [id])
  //   if (!error) {
  //     return RESPONSE_TYPE.commonSuccess({ res })
  //   }
  //   return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  // }
}

const documentService = new DocumentService()

export default documentService
