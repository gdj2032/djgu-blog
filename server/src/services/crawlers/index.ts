import { RequestMapping, Get, Post } from "@/request"
import CrawlersService from "./service"

@RequestMapping('/crawlers')
export default class User {

  @Get('/list')
  list(...args) {
    return CrawlersService.list(...args)
  }

  @Post('/download')
  download(...args) {
    return CrawlersService.download(...args)
  }
}
