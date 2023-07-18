import { RequestMapping, Get, Post } from "@/request"
import fileService from "./service"

@RequestMapping('/file')
export default class File {

  @Post('/upload', true)
  upload(...args) {
    return fileService.upload(...args)
  }
  @Get('/:id')
  content(...args) {
    return fileService.getFile(...args)
  }
  // @UploadDirectory('/upload/directory', true)
  // uploadDirectory(...args) {
  //   return fileService.uploadDirectory(...args)
  // }
}
