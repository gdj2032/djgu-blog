// @ts-nocheck
import { RequestMapping, Get, Post, Put, Delete } from "@/request"
import UserService from "./service"

@RequestMapping('/user')
export default class User {

  @Get('/', true)
  users(...args) {
    return UserService.Users(...args)
  }
  @Post('/login')
  login(...args) {
    return UserService.Login(...args)
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
