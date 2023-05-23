import { RequestMapping, Get, Post, Put, Upload } from "@/request"
import fileService from "./service"

@RequestMapping('/file')
export default class File {

  @Post('/upload', true)
  upload(...args) {
    return fileService.upload(...args)
  }
  // @Put('/')
  // put() {
  //   return 'put'
  // }
  // @Delete('/')
  // delete() {
  //   return 'delete'
  // }
}
