import { RequestMapping, Get, Post, Put, Delete } from "@/request"
import documentTypeService from "./service"

@RequestMapping('/document/type')
export default class DocumentType {

  @Get('/list')
  list(...args) {
    return documentTypeService.list(...args)
  }

  @Post('/create')
  create(...args) {
    return documentTypeService.create(...args)
  }

  @Put('/edit/:id')
  edit(...args) {
    return documentTypeService.edit(...args)
  }

  @Delete('/delete/:id')
  delete(...args) {
    return documentTypeService.delete(...args)
  }
}
