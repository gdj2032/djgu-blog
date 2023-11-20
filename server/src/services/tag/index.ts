import { RequestMapping, Get, Post, Put, Delete } from "@/requests"
import documentService from "./service"

@RequestMapping('/tag')
export default class Tag {

  @Get('/list')
  list(...args) {
    return documentService.list(...args)
  }
  @Get('/detail/:id')
  detail(...args) {
    return documentService.detail(...args)
  }
  @Post('/create', true)
  put(...args) {
    return documentService.create(...args)
  }
  @Put('/edit/:id', true)
  edit(...args) {
    return documentService.edit(...args)
  }
  @Delete('/delete/:id', true)
  delete(...args) {
    return documentService.delete(...args)
  }
}
