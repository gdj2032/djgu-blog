import { SERVER_PORT, FILE_PATH } from '@/constants';
import express from 'express'
import bodyParser from 'body-parser';
import { HEADER_CONFIG_KEY, HEADER_CONFIG_VALUE } from '@/constants';
import fileUpload from 'express-fileupload'

class App {
  app = express()

  static instance = new App()

  static listen(port: number) {
    this.instance.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: FILE_PATH
    }))
    this.instance.app.use(bodyParser.json());
    this.instance.app.use(bodyParser.urlencoded({ extended: false }));
    this.instance.app.use('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'url')
      res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
      res.header(HEADER_CONFIG_KEY.CONTENT_TYPE, HEADER_CONFIG_VALUE.APPLICATION_JSON);
      if (req.method == 'OPTIONS') return res.status(200).send('OK')
      next()
    });
    //设置模板引擎
    this.instance.app.set("view engine", "ejs");
    this.instance.app.listen(port, () => {
      console.log(`端口启动成功 port: ${SERVER_PORT}`)
    })
  }
}

export default App
