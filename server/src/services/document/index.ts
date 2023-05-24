import { RequestMapping, Get, Post, Put, Upload, Delete } from "@/request"
import documentService from "./service"

@RequestMapping('/document')
export default class Document {

  @Get('/list')
  list(...args) {
    return documentService.list(...args)
  }
  @Get('/detail/:id')
  detail(...args) {
    return documentService.detail(...args)
  }
  @Post('/create')
  put(...args) {
    return documentService.create(...args)
  }
  @Put('/edit/:id')
  edit(...args) {
    return documentService.edit(...args)
  }
  @Delete('/delete/:id')
  delete(...args) {
    return documentService.delete(...args)
  }
}
