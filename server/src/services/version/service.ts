import DataBase from "@/db";
import { VERSION_SQL } from "@/sql";
import { RESPONSE_TYPE, RESPONSE_CODE_MSG, commonUuid } from "@/utils";
import moment from 'moment';
import compressing from 'compressing'
import { FILE_PATH, isDev, NGINX_FILE_PATH_CFG, VERSION_TYPE } from "@/constants";
import fs from 'fs'
import { exec } from 'child_process'

class VersionService {
  async list(...args) {
    const [req, res] = args;
    const { limit = 10, offset = 0 } = req.query as any;
    const _limit = +limit;
    const _offset = +offset;
    const { data } = await DataBase.sql(VERSION_SQL.queryLimitOffset, [_offset, _limit])
    const allData = await this.allVersions()
    return RESPONSE_TYPE.commonSuccess2List({
      res,
      data,
      limit: _limit,
      offset: _offset,
      total: allData.length,
    })
  }

  async allVersions() {
    const { data } = await DataBase.sql(VERSION_SQL.queryAll)
    return data
  }

  async versionById(id) {
    const { data } = await DataBase.sql(VERSION_SQL.queryById, [id])
    return data
  }

  async versionByIds(ids) {
    const { data } = await DataBase.sql(VERSION_SQL.queryByIds, [ids])
    return data
  }

  async versionByUsedType(used, type) {
    const { data } = await DataBase.sql(VERSION_SQL.query, [used, type])
    return data
  }

  async create(...args) {
    const [req, res] = args;
    const { name, zipPath, type } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !zipPath, ...RESPONSE_CODE_MSG.pathNotEmpty },
        { func: () => typeof type !== 'number', ...RESPONSE_CODE_MSG.versionTypeNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(VERSION_SQL.queryByName, [name])
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
    const tId = commonUuid()
    const time = moment().valueOf();
    await DataBase.sql(VERSION_SQL.insert, [tId, name, 0, time, zipPath, type])
    const { data } = await DataBase.sql(VERSION_SQL.queryByName, [name]);
    return RESPONSE_TYPE.commonSuccess({ res, data: data[0] })
  }

  async edit(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const { name, used, zipPath } = req.body as any;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        { func: () => !name, ...RESPONSE_CODE_MSG.nameNotEmpty },
        { func: () => !zipPath, ...RESPONSE_CODE_MSG.pathNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(VERSION_SQL.queryByName, [name])
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
            const { data: d1 } = await DataBase.sql(VERSION_SQL.queryById, [id])
            return !d1?.length;
          },
          ...RESPONSE_CODE_MSG.versionNotExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const time = moment().valueOf();
    await DataBase.sql(VERSION_SQL.update, [{ name, used, updateTime: time, zipPath }, id])
    const { data } = await DataBase.sql(VERSION_SQL.queryById, [id]);
    return RESPONSE_TYPE.commonSuccess({ res, data: data[0] })
  }

  async delete(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(VERSION_SQL.queryById, [id])
            return !d1?.length;
          },
          ...RESPONSE_CODE_MSG.versionNotExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    const d = await this.versionById(id)
    if (d[0].used) {
      return RESPONSE_TYPE.commonError({ res, ...RESPONSE_CODE_MSG.versionIsUsed })
    }
    const { error } = await DataBase.sql(VERSION_SQL.deleteById, [id])
    if (!error) {
      // 删除压缩包
      fs.unlinkSync(d[0].zipPath)
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }

  async updateUsedVersion(...args) {
    const [req, res] = args;
    const { id } = req.params;
    const errorAble = await RESPONSE_TYPE.commonErrors({
      res,
      errs: [
        { func: () => !id, ...RESPONSE_CODE_MSG.idNotEmpty },
        {
          func: async () => {
            const { data: d1 } = await DataBase.sql(VERSION_SQL.queryById, [id])
            return !d1?.length;
          },
          ...RESPONSE_CODE_MSG.versionNotExist,
        },
      ]
    })
    if (errorAble) return errorAble;
    // 要执行的文件信息
    const d0 = await this.versionById(id)
    const d1 = await this.versionByUsedType(1, d0[0].type)
    if (d1?.[0]?.id) {
      await DataBase.sql(VERSION_SQL.update, [{ used: 0 }, d1[0]?.id])
    }
    const { error } = await DataBase.sql(VERSION_SQL.update, [{ used: 1 }, id])
    if (!error) {
      // 更新文件...
      const zipPath = d0[0].zipPath
      const webAble = VERSION_TYPE.isWeb(d0[0].type)
      const actualFolderPath = webAble ? NGINX_FILE_PATH_CFG.web : NGINX_FILE_PATH_CFG.server
      try {
        fs.rmdirSync(actualFolderPath)
      } catch (error) {
        console.info('--- rmdirSync error --->', error);
      }
      compressing.zip.uncompress(zipPath, actualFolderPath, { ignoreBase: true }).then(() => {
        console.log('解压完成')
        // 执行脚本...
        if (!isDev) {
          if (webAble) {
            exec('cd /usr/sbin ./nginx -s reload')
          } else {
            exec(`pm2 restart ${NGINX_FILE_PATH_CFG.server}/index.js`)
          }
        }
      }).catch(() => {
        console.log('解压失败')
      })
      return RESPONSE_TYPE.commonSuccess({ res })
    }
    return RESPONSE_TYPE.serverError(res, RESPONSE_CODE_MSG.serverError.msg)
  }
}

const versionService = new VersionService()

export default versionService
