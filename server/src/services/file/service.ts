import { fileUuid } from './../../utils/util';
import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, getSession, setSession, getUserIdNameBySession } from "@/utils";
import moment from "moment";
import * as fs from 'fs'

class FileService {

  // name: 'circle.jpeg',
  // data: <Buffer >,
  // size: 32956,
  // encoding: '7bit',
  // tempFilePath: '/Users/gdj/testImage/tmp-1-1684828261963',
  // truncated: false,
  // mimetype: 'image/jpeg',
  // md5: 'ce2474e576648ae2564135b606c480eb',
  // mv: [Function: mv]
  async upload(...args) {
    const [req, res] = args;
    if (req.files?.file) {
      const { name, tempFilePath } = req.files.file;
      const url = `${tempFilePath}_${name}`

      fs.renameSync(tempFilePath, url);

      return RESPONSE_TYPE.commonSuccess({ res, data: { url } })
    }
    return RESPONSE_TYPE.serverError(res, '上传文件失败')
  }
}

const fileService = new FileService()

export default fileService
