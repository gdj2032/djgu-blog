import DataBase from "@/db";
import { FILE_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from "moment";
import fs from "fs";
import http from "http";
import { FILE_PATH, FILE_TIME, FILE_TYPE } from "@/constants";

class FileService {
  constructor() {
    // this.deleteExpireFile()
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
      const url = await this.uploadFile({
        filename: name,
        localFile: tempFilePath,
      });

      return RESPONSE_TYPE.commonSuccess({ res, data: { url } });
    }
    if (req.files?.zip) {
      return this.uploadZip(req, res);
    }
    if (req.body?.content) {
      // 上传文本
      return this.uploadContent(req, res);
    }
    return RESPONSE_TYPE.commonError({
      res,
      ...RESPONSE_CODE_MSG.uploadFileError,
    });
  }

  async getFile(...args) {
    const [req, res] = args;
    const { id } = req.params as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [{ func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty }],
    });
    if (errorAble) return errorAble;
    const { error, data } = await DataBase.sql(FILE_SQL.queryById, [id]);
    if (!error && data?.[0]) {
      const u = data[0].url;
      const filepath = FILE_PATH + u;
      const file = fs.readFileSync(filepath).toString();
      return file;
    }
    return RESPONSE_TYPE.commonError({
      res,
      ...RESPONSE_CODE_MSG.fileContentError,
    });
  }

  private uploadFile = (info: { filename: string; localFile: string }) => {
    const { filename, localFile } = info;
    const today = moment().format("YYYY-MM-DD");
    const filepath = `${FILE_PATH}/${today}/${filename}`;
    fs.renameSync(localFile, filepath);
    // 上传之后删除本地文件
    fs.unlinkSync(localFile);
    return filepath;
  };

  private async uploadContent(req, res) {
    const { content, type } = req.body;
    if (!content)
      return RESPONSE_TYPE.commonError({
        res,
        ...RESPONSE_CODE_MSG.contentNotEmpty,
      });
    if (type === FILE_TYPE.content) {
      const today = moment().format("YYYY-MM-DD");
      const fileId = commonUuid();
      const filename = `${fileId}.txt`;
      const filepath = `${FILE_PATH}/${today}/${filename}`;
      // 创建文件
      fs.writeFileSync(filepath, content, { flag: "w", encoding: "utf-8" });
      const url = await this.uploadFile({
        filename,
        localFile: filepath,
      });
      const { error } = await DataBase.sql(FILE_SQL.insert, [
        fileId,
        url,
        0,
        moment().valueOf().toString(),
      ]);
      if (!error) {
        return RESPONSE_TYPE.commonSuccess({ res, data: { id: fileId, url } });
      }
    }
    return RESPONSE_TYPE.commonError({
      res,
      ...RESPONSE_CODE_MSG.uploadFileError,
    });
  }

  private uploadZip = async (...args) => {
    const [req, res] = args;
    console.info("--- uploadDirectory req.files --->", req.files);
    const { name, tempFilePath, mimetype } = req.files.zip;
    if (mimetype === "application/zip") {
      const fileId = commonUuid();
      const filename = `${fileId}_${name.split(".")?.[0] || name}.zip`;
      const filepath = `${FILE_PATH}/${filename}`;
      fs.renameSync(tempFilePath, filepath);
      return RESPONSE_TYPE.commonSuccess({
        res,
        data: { id: fileId, url: filepath },
      });
    }
    return RESPONSE_TYPE.commonError({
      res,
      ...RESPONSE_CODE_MSG.uploadFileError,
    });
  };

  deleteFile = async (url: string) => {
    if (url) {
      fs.unlinkSync(url);
    }
  };

  private async allFile() {
    const { data } = await DataBase.sql(FILE_SQL.queryAll);
    return data || [];
  }

  // 删除过期且未持久化的文件
  private deleteExpireFile = async () => {
    const files = await this.allFile();
    const curTime = moment().valueOf();
    const needDeleteFiles = files.filter((e) => {
      const moreOneDay = curTime - +e.createTime >= FILE_TIME;
      return +e.used === 0 && moreOneDay;
    });
    console.info("--- needDeleteFiles --->", needDeleteFiles);
    if (needDeleteFiles?.length > 0) {
      // 删除数据
      for (const e of needDeleteFiles) {
        this.deleteFile(e.id);
        DataBase.sql(FILE_SQL.deleteById, e.id);
      }
    }
  };
}

const fileService = new FileService();

export default fileService;
