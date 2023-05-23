import { fileUuid } from './../../utils/util';
import DataBase from "@/db";
import { USER_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, getSession, setSession, getUserIdNameBySession } from "@/utils";
import moment from "moment";
import * as fs from 'fs'
// import fs from 'fs'
// import co from 'co';
// import OSS from 'ali-oss';

// const client = new OSS({
//   region: ALI_KEY.REGION, // 公共云下OSS Region
//   accessKeyId: ALI_KEY.ACCESSKEY_ID, // AccessKey ID
//   accessKeySecret: ALI_KEY.ACCESSKEY_SECRET // AccessKey Secret
// });

// const ali_oss = {
//   bucket: ALI_KEY.BUCKET_NAME,	// Bucket名称
//   endPoint: ALI_KEY.ENDPOINT,	// 公共云下OSS 外网Endpoint
// };

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


  // fileUpload = async (params: IServiceParams) => {
  //   const { res, req, resKey } = params as any;
  //   const { fieldname, path: tempFilePath, mimetype, originalname } = req.file;
  //   if (fieldname === 'file') {
  //     if (tempFilePath) {
  //       try {
  //         const id = fileUuid()
  //         const mimeType = mimetype
  //         const filename = `${id}_${originalname}`
  //         const url = await this.aliUploadImage({
  //           filename,
  //           localFile: tempFilePath,
  //         })
  //         const data = {
  //           id,
  //           filename,
  //           url,
  //           mimeType,
  //           createTime: moment().valueOf().toString(),
  //           persistenceStorage: 0,
  //         }
  //         await sqlService(fileSql.add(data), resKey)
  //         RESPONSE_TYPE.commonSuccess({ res, data })
  //         return;
  //       } catch (error) {
  //         console.info('--- fileUpload error ---', error);
  //       }
  //     }
  //   }
  //   RESPONSE_TYPE.serverError(res, '上传文件失败')
  // }

  // // 删除过期且未持久化的文件
  // deleteExpireFile = async () => {
  //   const files = await sqlService(fileSql.all())
  //   const curTime = moment().valueOf()
  //   const needDeleteFiles = files.filter((e) => {
  //     const moreOneDay = (curTime - +e.createTime) >= FILE_TIME;
  //     return e.persistenceStorage === 0 && moreOneDay;
  //   })

  //   if (needDeleteFiles?.length > 0) {
  //     // 删除文件
  //     needDeleteFiles.forEach((e) => {
  //       fs.unlinkSync(e.url)
  //     })
  //     // 删除数据
  //     await sqlService(fileSql.batchDeleteById(needDeleteFiles.map((e) => e.id)))
  //   }
  // }

  // // 阿里云上传图片
  // aliUploadImage = (info: {
  //   filename: string;
  //   localFile: string;
  // }) => new Promise<string>((resolve, reject) => {
  //   const { filename, localFile } = info;
  //   // 阿里云 上传文件
  //   const today = moment().format('YYYY-MM-DD')
  //   const key = `${ALI_KEY.BUCKET_FILE_NAME}/${today}/${filename}`;
  //   co(function* () {
  //     client.useBucket(ali_oss.bucket);
  //     const result = yield client.put(key, localFile);
  //     // 上传成功返回图片路径域名-域名修改成自己绑定到oss的
  //     const imageSrc = `http://${ALI_KEY.ENDPOINT}/${result.name}`
  //     // 上传之后删除本地文件
  //     fs.unlinkSync(localFile);
  //     resolve(imageSrc)
  //   }).catch(function (err) {
  //     console.log("🚀 ~ file: file.ts:124 ~ FileService ~ co ~ err", err)
  //     // 上传之后删除本地文件
  //     fs.unlinkSync(localFile);
  //     reject('文件上传失败')
  //   })
  // })
}

const fileService = new FileService()

export default fileService
