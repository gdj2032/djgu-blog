import DataBase from "@/db";
import { FILE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from "moment";
import fs from 'fs'
import co from 'co';
import OSS from 'ali-oss';
import http from 'http'
import { ALI_KEY, FILE_TYPE, FILE_PATH } from '@/constants';

const client = new OSS({
  region: ALI_KEY.REGION, // 公共云下OSS Region
  accessKeyId: ALI_KEY.ACCESSKEY_ID, // AccessKey ID
  accessKeySecret: ALI_KEY.ACCESSKEY_SECRET // AccessKey Secret
});

const ali_oss = {
  bucket: ALI_KEY.BUCKET_NAME,	// Bucket名称
  endPoint: ALI_KEY.ENDPOINT,	// 公共云下OSS 外网Endpoint
};

class FileService {

  constructor() {
    // setInterval(() => {
    //   this.deleteExpireFile()
    // }, FILE_TIME)
  }

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
      const url = await this.aliUpload({
        filename: name,
        localFile: tempFilePath,
      })

      return RESPONSE_TYPE.commonSuccess({ res, data: { url } })
    }
    if (req.files?.zip) {
      return this.uploadZip(req, res)
    }
    if (req.body?.content) {
      // 上传文本
      return this.uploadContent(req, res)
    }
    return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.uploadFileError })
  }

  async getFile(...args) {
    const [req, res] = args;
    const { id } = req.params as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
      ]
    })
    if (errorAble) return errorAble;
    const { error, data } = await DataBase.sql(FILE_SQL.queryById, [id])
    if (!error && data?.[0]) {
      const u = data[0].url
      http.get(u, (stream) => {
        stream.pipe(res);
      });
      return { returns: true }
    }
    return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.fileContentError })
  }

  // 阿里云上传图片
  private aliUpload = (info: {
    filename: string;
    localFile: string;
  }) => new Promise<string>((resolve, reject) => {
    const { filename, localFile } = info;
    // 阿里云 上传文件
    const today = moment().format('YYYY-MM-DD')
    const key = `${ALI_KEY.BUCKET_FILE_NAME}/${today}/${filename}`;
    co(function* () {
      client.useBucket(ali_oss.bucket);
      const result = yield client.put(key, localFile);
      // 上传成功返回图片路径域名-域名修改成自己绑定到oss的
      const imageSrc = `http://${ALI_KEY.ENDPOINT}/${result.name}`
      // 上传之后删除本地文件
      fs.unlinkSync(localFile);
      resolve(imageSrc)
    }).catch(function (err) {
      console.log("🚀 ~ file: file.ts:124 ~ FileService ~ co ~ err", err)
      // 上传之后删除本地文件
      fs.unlinkSync(localFile);
      reject('文件上传失败')
    })
  })

  private async uploadContent(req, res) {
    const { content, type } = req.body
    if (!content) return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.contentNotEmpty });
    if (type === FILE_TYPE.content) {
      const fileId = commonUuid()
      const filename = `${fileId}.txt`;
      const filepath = `${FILE_PATH}/${filename}`;
      // 创建文件
      fs.writeFileSync(filepath, content, { flag: 'w', encoding: 'utf-8' })
      const url = await this.aliUpload({
        filename,
        localFile: filepath,
      })
      const { error } = await DataBase.sql(FILE_SQL.insert, [fileId, url, 0, moment().valueOf().toString()])
      if (!error) {
        return RESPONSE_TYPE.commonSuccess({ res, data: { id: fileId, url } })
      }
    }
    return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.uploadFileError })
  }

  private uploadZip = async (...args) => {
    const [req, res] = args;
    console.info('--- uploadDirectory req.files --->', req.files);
    const { name, tempFilePath, mimetype } = req.files.zip;
    if (mimetype === 'application/zip') {
      const fileId = commonUuid()
      const filename = `${fileId}_${name.split('.')?.[0] || name}.zip`;
      const filepath = `${FILE_PATH}/${filename}`;
      fs.renameSync(tempFilePath, filepath)
      return RESPONSE_TYPE.commonSuccess({ res, data: { id: fileId, url: filepath } })
    }
    return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.uploadFileError })
  }

  private async allFile() {
    return DataBase.sql(FILE_SQL.queryAll)
  }

  // 删除过期且未持久化的文件
  private deleteExpireFile = async () => {
    const files = await this.allFile()
    const curTime = moment().valueOf()
    // const needDeleteFiles = files.filter((e) => {
    //   const moreOneDay = (curTime - +e.createTime) >= FILE_TIME;
    //   return e.persistenceStorage === 0 && moreOneDay;
    // })

    // if (needDeleteFiles?.length > 0) {
    //   // 删除数据
    //   await DataBase.sql(FILE_SQL.deleteById, )
    // }
  }
}

const fileService = new FileService()

export default fileService
