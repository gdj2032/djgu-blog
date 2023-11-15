import { RouteService } from "@/typings/route";
import { USER_ROLE } from ".";

export const DEFAULT_ROUTE: RouteService.IListData = {
  id: '2',
  name: '首页',
  path: '/home',
  role: USER_ROLE.common,
}