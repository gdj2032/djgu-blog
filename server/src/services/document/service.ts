import { ALI_KEY } from "@/constants";
import DataBase from "@/db";
import { DOCUMENT_SQL, FILE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';
import fileService from "../file/service";
import routeService from "../route/service";
import tagService from "../tag/service";

class DocumentService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0, name = '', latest = false, routeId } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const sqlOpt = DOCUMENT_SQL.queryLimitOffsetFn({ limit: _limit, offset: _offset, name, routeId, orderType: latest ? 'createTime' : 'see' })
    const { error, data } = await DataBase.sql(sqlOpt.sql, sqlOpt.data)
    if (error) {
      return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
    }
    const allRoutes = await routeService.all()
    const allTags = await tagService.all()
    const newData = data?.map((e) => {
      return {
        ...e,
        route: allRoutes.find((v) => v.id === e.routeId),
        tags: allTags?.filter(v => e.tagIds?.includes(v.id))
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
      const route = await routeService.queryById(data[0].routeId)
      const tags = await tagService.queryByIds(data[0].tagIds)
      return RESPONSE_TYPE.commonSuccess({
        res,
        data: {
          ...data[0],
          route,
          tags,
        },
      })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }

  async create(...args) {
    const [req, res] = args;
    const { name, description, fileId, routeId, tagIds } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !fileId, ...RESPONSE_CODE_MSG.fileNotEmpty },
        { func: () => !routeId, ...RESPONSE_CODE_MSG.routeIdNotEmpty },
        { func: () => !tagIds?.length, ...RESPONSE_CODE_MSG.tagNotEmpty },
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
    const { error } = await DataBase.sql(DOCUMENT_SQL.insert, [dId, name, description, fileId, routeId, time, time, 0, tagIds.join(',')])
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
    const { name, description, routeId, fileId, tagIds = [] } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !fileId, ...RESPONSE_CODE_MSG.fileNotEmpty },
        { func: () => !routeId, ...RESPONSE_CODE_MSG.routeIdNotEmpty },
        { func: () => !tagIds?.length, ...RESPONSE_CODE_MSG.tagNotEmpty },
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
    const detailInfo = await DataBase.sql(DOCUMENT_SQL.queryById, [id])
    const updateInfo = await DataBase.sql(DOCUMENT_SQL.update, [{ name, description, routeId, fileId, tagIds: tagIds.join(','), updateTime: time }, id])
    if (!updateInfo.error) {
      const { data } = await DataBase.sql(DOCUMENT_SQL.queryById, [id]);
      DataBase.sql(FILE_SQL.update, [{ used: 1 }, fileId])
      this.deleteFile(detailInfo.data[0].fileId)
      return RESPONSE_TYPE.commonSuccess({
        res, data,
      })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
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
    const detailInfo = await DataBase.sql(DOCUMENT_SQL.queryById, [id])
    const { error } = await DataBase.sql(DOCUMENT_SQL.deleteById, [id])
    if (!error) {
      this.deleteFile(detailInfo.data[0].fileId)
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

  deleteFile = async (fileId: string) => {
    if (fileId) {
      const { error: fErr, data: fData } = await DataBase.sql(FILE_SQL.queryById, [fileId])
      if (!fErr) {
        const url = fData?.[0]?.url;
        if (url) {
          const urls = url.split(ALI_KEY.BUCKET_FILE_NAME)
          const filePath = `${ALI_KEY.BUCKET_FILE_NAME}${urls[1]}`
          fileService.deleteFile(filePath)
        }
      }
    }
  }
}

const documentService = new DocumentService()

export default documentService
