import { USER_ROLE } from "@/constants";
import DataBase from "@/db";
import { DOCUMENT_SQL, ROUTE_SQL, TAG_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid, getUserIdNameBySession } from "@/utils";
import moment from 'moment';
import routeService from "../route/service";

class TagService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name, routeId } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const sqlOpt = TAG_SQL.queryLimitOffsetFn({ limit: _limit, offset: _offset, name, routeId })
    const { error, data } = await DataBase.sql(sqlOpt.sql, sqlOpt.data)
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    const allRoute = await routeService.all()
    const data1 = data.map(e => ({
      ...e,
      route: allRoute.find(v => v.id === e.routeId),
    }))
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: data1,
      limit: _limit,
      offset: _offset,
      total: data?.length || 0,
    })
  }

  async all() {
    const { data } = await DataBase.sql(TAG_SQL.queryAll)
    return data || []
  }

  async queryById(id) {
    const { data } = await DataBase.sql(TAG_SQL.queryById, [id])
    return data
  }

  async queryByIds(ids) {
    const { data } = await DataBase.sql(TAG_SQL.queryByIds, [ids])
    return data
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
    const { error, data } = await DataBase.sql(TAG_SQL.queryById, [id])
    if (!error) {
      return RESPONSE_TYPE.commonSuccess({
        res,
        data: {
          ...data[0],
        },
      })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }

  async create(...args) {
    const [req, res] = args;
    const { name, description, routeId } = req.body as any;
    const userInfo = getUserIdNameBySession(req.headers?.session as string);
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !routeId, ...RESPONSE_CODE_MSG.routeNotExist },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(TAG_SQL.queryByName, [name])
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
    const time = moment().valueOf()
    const { error } = await DataBase.sql(TAG_SQL.insert, [dId, name, description, routeId, time, time, userInfo?.id])
    if (error) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.tagInsertError })
    }
    const { data } = await DataBase.sql(TAG_SQL.queryById, [dId]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, routeId } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !routeId, ...RESPONSE_CODE_MSG.routeNotExist },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(TAG_SQL.queryByName, [name])
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
    const time = moment().valueOf()
    await DataBase.sql(TAG_SQL.update, [{ name, description, routeId, updateTime: time }, id])
    const { data } = await DataBase.sql(TAG_SQL.queryById, [id]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async delete(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const par = await DataBase.sql(TAG_SQL.queryById, [id])
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        {
          func: async () => {
            return !par.data?.[0]
          },
          ...RESPONSE_CODE_MSG.tagNotExist
        },
        {
          func: async () => {
            const par1 = await DataBase.sql(DOCUMENT_SQL.queryByTagId, [id])
            if (par1.data?.length) {
              return true
            }
            return false
          },
          ...RESPONSE_CODE_MSG.tagUsedNotDelete
        },
      ]
    })
    if (errorAble) return errorAble;
    const { error } = await DataBase.sql(TAG_SQL.deleteById, [id])
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    return RESPONSE_TYPE.commonSuccess({ res })
  }
}

const tagService = new TagService()

export default tagService
