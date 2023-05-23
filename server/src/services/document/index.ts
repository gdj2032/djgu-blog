import { RequestMapping, Get, Post, Put, Upload } from "@/request"
import documentService from "./service"

@RequestMapping('/document')
export default class File {

  @Get('/')
  list(...args) {
    return documentService.list(...args)
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
