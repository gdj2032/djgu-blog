import { RequestMapping, Get, Post, Put, Delete } from "@/request"
import UserService from "./service"

@RequestMapping('/user')
export default class User {

  @Get('/', true)
  users(...args) {
    return UserService.list(...args)
  }
  @Post('/login')
  login(...args) {
    return UserService.login(...args)
  }
  @Post('/logout', true)
  logout(...args) {
    return UserService.logout(...args)
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
