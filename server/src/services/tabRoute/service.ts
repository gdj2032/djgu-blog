import { USER_ROLE } from "@/constants";
import DataBase from "@/db";
import { TAB_ROUTE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';

class TabRouteService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    console.info('--- info --->', { limit, offset });
    const _limit = +limit;
    const _offset = +offset;
    const { error, data } = await DataBase.sql(TAB_ROUTE_SQL.queryLimitOffset, [_offset, _limit])
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    const { data: allData } = await DataBase.sql(TAB_ROUTE_SQL.queryAll)
    return RESPONSE_TYPE.commonSuccess2List({
      res, data,
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
    const { error, data } = await DataBase.sql(TAB_ROUTE_SQL.queryById, [id])
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
    const { name, description, parentId, path, role = USER_ROLE.common } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !path, ...RESPONSE_CODE_MSG.pathNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(TAB_ROUTE_SQL.queryByName, [name])
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
    const { error } = await DataBase.sql(TAB_ROUTE_SQL.insert, [dId, name, description, parentId, path, role, '', time])
    if (error) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.tabRouteInsertError })
    }
    const { data } = await DataBase.sql(TAB_ROUTE_SQL.queryById, [dId]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, parentId, path, role = USER_ROLE.common } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(TAB_ROUTE_SQL.queryByName, [name])
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
    await DataBase.sql(TAB_ROUTE_SQL.update, [{ name, description, parentId, path, role }, id])
    const { data } = await DataBase.sql(TAB_ROUTE_SQL.queryById, [id]);
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
    const { error } = await DataBase.sql(TAB_ROUTE_SQL.deleteById, [id])
    if (!error) {
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }
}

const tabRouteService = new TabRouteService()

export default tabRouteService
