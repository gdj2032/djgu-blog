import { USER_ROLE } from "@/constants";
import DataBase from "@/db";
import { DOCUMENT_SQL, ROUTE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';

class RouteService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, onlyParent = false, onlyChildren = false } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { error, data } = await DataBase.sql(ROUTE_SQL.queryLimitOffset, [_offset, _limit])
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    const data1 = data.filter(e => {
      if (onlyParent) {
        if (USER_ROLE.isAdmin(e.role)) return false;
        return !e.father_id
      }
      if (onlyChildren) {
        return !!e.father_id
      }
      return true;
    })
    let data2 = data1
    if (!onlyChildren) {
      data2 = this.handleRoutes(data1)
    }
    return RESPONSE_TYPE.commonSuccess2List({
      res, data: data2,
      limit: _limit,
      offset: _offset,
      total: data2.length,
    })
  }

  handleRoutes(data) {
    const r: any[] = []
    for (const item of data) {
      if (!item.father_id) {
        const childrenRoutes = data.filter(e => item.id === e.father_id);
        item.children = childrenRoutes?.length ? childrenRoutes : null;
        r.push(item)
      }
    }
    return r;
  }

  async all() {
    const { data } = await DataBase.sql(ROUTE_SQL.queryAll)
    return data || []
  }


  async typeById(id) {
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [id])
    return data
  }

  async typeByIds(ids) {
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
    const { name, description, father_id, path, role = USER_ROLE.common } = req.body as any;
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
      ]
    })
    if (errorAble) return errorAble;
    const dId = commonUuid()
    const { error } = await DataBase.sql(ROUTE_SQL.insert, [dId, name, description, father_id, path, role])
    if (error) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.tabRouteInsertError })
    }
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [dId]);

    if (!father_id) {
      // 需要自动新增一个子级
      const dId2 = commonUuid()
      await DataBase.sql(ROUTE_SQL.insert, [dId2, name, '', dId, path + path, role])
    }
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, description, father_id, path, role = USER_ROLE.common } = req.body as any;
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
      ]
    })
    if (errorAble) return errorAble;
    await DataBase.sql(ROUTE_SQL.update, [{ name, description, father_id, path, role }, id])
    const { data } = await DataBase.sql(ROUTE_SQL.queryById, [id]);
    return RESPONSE_TYPE.commonSuccess({
      res, data,
    })
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
            if (!fatherId) {
              const par1 = await DataBase.sql(ROUTE_SQL.queryByFatherId, [id])
              if (par1.data?.length) {
                return true
              }
            }
            return false
          },
          ...RESPONSE_CODE_MSG.fatherRouteNotDeleteForChild
        },
        {
          func: async () => {
            const par1 = await DataBase.sql(DOCUMENT_SQL.queryByTypes, [id])
            return !!par1.data?.length
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
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }
}

const routeService = new RouteService()

export default routeService
