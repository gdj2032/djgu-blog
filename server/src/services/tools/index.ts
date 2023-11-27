import { RequestMapping, Post } from "@/requests"
import toolsService from "./service"

@RequestMapping('/tools')
export default class Tag {

  @Post('/data2Interface')
  data2Interface(...args) {
    return toolsService.data2Interface(...args)
  }
}
