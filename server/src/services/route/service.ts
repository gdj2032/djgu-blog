import { USER_ROLE } from "@/constants";
import DataBase from "@/db";
import { DOCUMENT_SQL, ROUTE_SQL, TAG_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';

class RouteService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { error, data } = await DataBase.sql(ROUTE_SQL.queryLimitOffset, [_offset, _limit])
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    return RESPONSE_TYPE.commonSuccess2List({
      res, data,
      limit: _limit,
      offset: _offset,
      total: data.length,
    })
  }

  async all() {
    const { data } = await DataBase.sql(ROUTE_SQL.queryAll)
    return data || []
  }

  async queryById(id) {
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [id])
    return data?.[0]
  }

  async queryByIds(ids) {
    const { data } = await DataBase.sql(ROUTE_SQL.queryByIds, [ids])
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
    const { error, data } = await DataBase.sql(ROUTE_SQL.queryById, [id])
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
    const { name, description, path, role = USER_ROLE.common } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !path, ...RESPONSE_CODE_MSG.pathNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(ROUTE_SQL.queryByName, [name])
            if (d1?.length) {
              return true;
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.nameExist,
        },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(ROUTE_SQL.queryByPath, [path])
            if (d1?.length) {
              return true;
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.pathExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const dId = commonUuid()
    const { error } = await DataBase.sql(ROUTE_SQL.insert, [dId, name, description, path, role])
    if (error) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.routeInsertError })
    }
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [dId]);
    return RESPONSE_TYPE.commonSuccess({ res, data })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, path, role = USER_ROLE.common } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(ROUTE_SQL.queryByName, [name])
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
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(ROUTE_SQL.queryByPath, [path])
            if (d1?.length) {
              const d2 = d1.filter(e => e.id !== id);
              if (d2?.length) {
                return true;
              }
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.pathExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const { error, data: data1 } = await DataBase.sql(ROUTE_SQL.update, [{ name, description, path, role }, id])
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [id]);
    if (!error) {
      return RESPONSE_TYPE.commonSuccess({ res, data })
    }
    return RESPONSE_TYPE.serverError(res, error || RESPONSE_CODE_MSG.serverError.msg)
  }

  async delete(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const par = await DataBase.sql(ROUTE_SQL.queryById, [id])
    const fatherId = par.data?.[0]?.father_id
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        {
          func: async () => {
            return !par.data?.[0]
          },
          ...RESPONSE_CODE_MSG.routeNotExist
        },
        {
          func: async () => {
            const par1 = await DataBase.sql(DOCUMENT_SQL.queryByRouteId, [id])
            if (par1.data?.length) {
              return true
            }
            const par2 = await DataBase.sql(TAG_SQL.queryByRouteId, [id])
            if (par2.data?.length) {
              return true
            }
            return false;
          },
          ...RESPONSE_CODE_MSG.routeUsedNotDelete
        },
      ]
    })
    if (errorAble) return errorAble;
    const { error } = await DataBase.sql(ROUTE_SQL.deleteById, [id])
    if (!error) {
      // 如果根路由只存在当前一个子路由,则同步删除根路由
      await DataBase.sql(ROUTE_SQL.deleteById, [fatherId])
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, error || RESPONSE_CODE_MSG.serverError.msg)
  }
}

const routeService = new RouteService()

export default routeService
