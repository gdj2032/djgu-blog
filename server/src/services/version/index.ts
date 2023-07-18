import { RequestMapping, Get, Post, Put, Delete } from "@/request"
import versionService from "./service"

@RequestMapping('/version')
export default class Version {

  @Get('/list')
  list(...args) {
    return versionService.list(...args)
  }

  @Post('/create')
  create(...args) {
    return versionService.create(...args)
  }

  @Put('/edit/:id')
  edit(...args) {
    return versionService.edit(...args)
  }

  @Delete('/delete/:id')
  delete(...args) {
    return versionService.delete(...args)
  }

  @Post('/used/:id')
  used(...args) {
    return versionService.updateUsedVersion(...args)
  }
}
