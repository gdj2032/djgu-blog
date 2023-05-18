// @ts-nocheck
import { RequestMapping, Get, Post, Put, Delete } from "@/request"
import UserService from "./service"

@RequestMapping('/user')
export default class User {

  @Get('/')
  async get(...args) {
    return UserService.Users(...args)
  }
  @Post('/')
  post() {
    return 'post'
  }
  @Put('/')
  put() {
    return 'put'
  }
  @Delete('/')
  delete() {
    return 'delete'
  }
}
