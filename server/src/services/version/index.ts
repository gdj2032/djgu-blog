import { RequestMapping, Get, Post, Put, Delete } from "@/requests"
import versionService from "./service"

@RequestMapping('/version')
export default class Version {

  @Get('/list', true)
  list(...args) {
    return versionService.list(...args)
  }

  @Post('/create', true)
  create(...args) {
    return versionService.create(...args)
  }

  @Put('/edit/:id', true)
  edit(...args) {
    return versionService.edit(...args)
  }

  @Delete('/delete/:id', true)
  delete(...args) {
    return versionService.delete(...args)
  }

  @Post('/used/:id', true)
  used(...args) {
    return versionService.updateUsedVersion(...args)
  }
}
