import * as https from 'https'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'
import request from 'request'
import { CRAWLERS_SQL } from '@/sql'
import DataBase from '@/db'
import compressing from 'compressing'

interface ICrawlersUtilProps {
  id: string;
  url: string;
  firstPage: number;
  lastPage: number;
}

class CrawlersUtil {
  props: ICrawlersUtilProps;
  dirPath: string;

  constructor(props: ICrawlersUtilProps) {
    this.props = props;
    this.dirPath = path.resolve('tmp');
    const isDir = fs.statSync(this.dirPath).isDirectory()
    console.log("🚀 ~ file: CrawlersUtil.ts:24 ~ CrawlersUtil ~ constructor ~ isDir:", isDir)
    if (isDir) {
      this.emptyDir(this.dirPath);
    } else {
      fs.mkdirSync(this.dirPath);
    }
  }
  init = async () => {
    const { id, url, firstPage, lastPage } = this.props;
    const { error, data } = await DataBase.sql(CRAWLERS_SQL.queryById, [id])
    console.log("🚀 ~ file: CrawlersUtil.ts:27 ~ CrawlersUtil ~ init= ~ error, data:", error, data)
    if (!error && data?.[0]) {
      const item = data[0]
      if (item.id === '1697092786363466467') {
        // 素材公社
        // https://www.tooopen.com/img/87_312.html
        // https://www.tooopen.com/img/87_312_1_1.html
        if (url.includes(item.url)) {
          const len = url.split('_').length - 1;
          let pages: string[] = []
          if (len === 1) {
            for (let i = firstPage; i <= lastPage; i++) {
              const page = url.replace('.html', `1_${i}.html`)
              await this.requestCommon1697092786363466467(page)
              pages.push(page)
            }
          } else if (len === 3) {
            const urls = url.split('_')
            for (let i = firstPage; i <= lastPage; i++) {
              const page = `${urls[0]}_${urls[1]}_${urls[2]}_${i}.html`
              await this.requestCommon1697092786363466467(page)
              pages.push(page)
            }
          }
          console.info('--- pages --->', pages);
          if (pages.length > 0) {
            const zipPath = this.dirPath + '.zip'
            console.log("🚀 ~ file: CrawlersUtil.ts:62 ~ CrawlersUtil ~ init= ~ zipPath:", zipPath)
            await compressing.zip.compressDir(this.dirPath, zipPath, { zipFileNameEncoding: 'gbk' })
            return zipPath;
          }
        }
      }
    }
    return ''
  }

  private requestCommon1697092786363466467(url) {
    return new Promise<string>(async (resolve) => {
      const $ = await this.httpRequest(url)
      for (const el of $('.pic img')) {
        const src = $(el).attr('src') as string;
        await this.downloadImage(src, url)
      }
      resolve('')
    })
  }

  private httpRequest(url: string) {
    return new Promise<cheerio.CheerioAPI>((resolve) => {
      https.get(url, (response) => {
        let str = ''
        response.on('data', (chunk) => {
          str += chunk
        })
        response.on('end', async () => {
          const $ = cheerio.load(str)
          resolve($)
        })
      })
    })
  }

  private downloadImage(url, host) {
    const filename = path.basename(url)
    const filepath = path.resolve(this.dirPath, filename);
    return new Promise((resolve, reject) => {
      const localPath = fs.createWriteStream(filepath);
      setTimeout(() => {
        request({
          uri: url,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            Referer: host,
          }
        }).pipe(localPath).on('close', () => {
          localPath.close()
          console.info(`--- ${filename} 下载完成 ---`);
          resolve('1')
        })
      }, 200);
    });
  }

  private emptyDir(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
      const filePath = `${path}/${file}`;
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        this.emptyDir(filePath);
      } else {
        fs.unlinkSync(filePath);
        console.log(`删除${file}文件成功`);
      }
    });
  }
}

export {
  CrawlersUtil,
  ICrawlersUtilProps,
};
