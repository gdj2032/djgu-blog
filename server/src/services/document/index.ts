import { RequestMapping, Get, Post, Put, Upload } from "@/request"
import documentService from "./service"

@RequestMapping('/document')
export default class Document {

  @Get('/list')
  list(...args) {
    return documentService.list(...args)
  }
  @Post('/create')
  put(...args) {
    return documentService.create(...args)
  }
  // @Delete('/')
  // delete() {
  //   return 'delete'
  // }
}
