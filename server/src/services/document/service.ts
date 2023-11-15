import DataBase from "@/db";
import { DOCUMENT_SQL, FILE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';
import routeService from "../route/service";

class DocumentService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name = '', latest = false } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    let error0, data0;
    if (!latest) {
      const { error, data } = await DataBase.sql(DOCUMENT_SQL.queryLimitOffset2, [`%${name}%`, `%${name}%`, _offset, _limit])
      error0 = error;
      data0 = data
    } else {
      const { error, data } = await DataBase.sql(DOCUMENT_SQL.queryLimitOffset, [_offset, _limit])
      error0 = error;
      data0 = data
    }
    if (error0) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    const allRoutes = await routeService.all()
    const newData = data0?.map((e) => {
      const cTypes = e.types.split(',')
      return {
        ...e,
        types: allRoutes.filter((v) => cTypes.includes(v.id)),
      }
    })
    const allData = await this.all()
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: newData,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async all() {
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryAll)
    return data || []
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
      const types = (await routeService.typeByIds(data[0].types.split(','))).map((e) => ({ id: e.id, name: e.name }))
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
    const { name, description, fileId, types } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !fileId, ...RESPONSE_CODE_MSG.fileNotEmpty },
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
    const dId = commonUuid()
    const time = moment().valueOf();
    const { error } = await DataBase.sql(DOCUMENT_SQL.insert, [dId, name, description, fileId, types.join(','), time, time, 0])
    if (error) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.documentInsertError })
    }
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [dId]);
    DataBase.sql(FILE_SQL.update, [{ used: 1 }, fileId])
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, fileId, types } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !fileId, ...RESPONSE_CODE_MSG.fileNotEmpty },
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
    await DataBase.sql(DOCUMENT_SQL.update, [{ name, description, fileId, types: types.join(','), updateTime: time }, id])
    const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [id]);
    DataBase.sql(FILE_SQL.update, [{ used: 1 }, fileId])
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
