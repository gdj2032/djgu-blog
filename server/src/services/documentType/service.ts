import { DOCUMENT_TYPE_SQL } from './../../sql/documentType';
import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE, documentTypeUuid } from "@/utils";
import userService from '../user/service';

class DocumentTypeService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
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
    const { } = req.body as any;
    const id = documentTypeUuid()
    return { success: 1 }
  }
}

const documentTypeService = new DocumentTypeService()

export default documentTypeService
