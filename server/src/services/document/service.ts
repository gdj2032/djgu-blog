import { documentUuid } from './../../utils/util';
import DataBase from "@/db";
import { DOCUMENT_SQL, USER_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG } from "@/utils";
import userService from '../user/service';
import moment from 'moment';
import documentTypeService from '../documentType/service';

class DocumentService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name = '', types } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryLimitOffset, [_offset, _limit, name])
    const allTypes = (await documentTypeService.allTypes()).map((e) => ({ id: e.id, name: e.name }))
    const newData = data?.map((e) => {
      const cTypes = JSON.parse(e.types)
      return {
        ...e,
        types: allTypes.filter((v) => cTypes.includes(v.id)),
      }
    })
    const { data: allData } = await DataBase.sql(DOCUMENT_SQL.queryAll)
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: newData,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async detail(...args) {
    const [req, res] = args;
    const { id } = req.params as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
      ]
    })
    if (errorAble) return errorAble;
    const { error, data } = await DataBase.sql(DOCUMENT_SQL.queryById, [id])
    if (!error) {
      const types = (await documentTypeService.typeByIds(JSON.parse(data[0].types))).map((e) => ({ id: e.id, name: e.name }))
      return RESPONSE_TYPE.commonSuccess({
        res,
        data: {
          ...data[0],
          types,
        },
      })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
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
    await DataBase.sql(DOCUMENT_SQL.insert, [dId, name, description, content, JSON.stringify(types), time, time, 0])
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [dId]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, content, types } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !content, ...RESPONSE_CODE_MSG.contentNotEmpty },
        { func: () => !types?.length, ...RESPONSE_CODE_MSG.typeNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(DOCUMENT_SQL.queryByName, [name])
            if (d1?.length) {
              const d2 = d1.filter(e => e.id !== id);
              if (d2?.length) {
                return true;
              }
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.nameExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const time = moment().valueOf();
    await DataBase.sql(DOCUMENT_SQL.update, [{ name, description, content, types: JSON.stringify(types), updateTime: time }, id])
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [id]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
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
    const { error } = await DataBase.sql(DOCUMENT_SQL.deleteById, [id])
    if (!error) {
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }

  async see(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { error, data } = await DataBase.sql(DOCUMENT_SQL.queryById, [id]);
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !data?.[0], ...RESPONSE_CODE_MSG.documentNotExist },
        {
          func: async () => {
            if (error) return true;
            return false;
          }, ...RESPONSE_CODE_MSG.serverError
        },
      ]
    })
    if (errorAble) return errorAble;
    const { error: e2 } = await DataBase.sql(DOCUMENT_SQL.update, [{ see: data[0].see + 1 }, id])
    if (e2) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    return RESPONSE_TYPE.commonSuccess({ res })
  }
}

const documentService = new DocumentService()

export default documentService
