import { USER_ROLE } from ".";

export const DEFAULT_ROUTE_OPTION = {
  routes: [
    {
      id: '1',
      name: '主页',
      path: '/index',
      role: USER_ROLE.common,
    },
    {
      id: '2',
      name: '工具',
      path: '/tools',
      role: USER_ROLE.common,
    },
  ],
  routeIds: () => DEFAULT_ROUTE_OPTION.routes.map(e => e.id),
  routeNames: () => DEFAULT_ROUTE_OPTION.routes.map(e => e.name),
  routePaths: () => DEFAULT_ROUTE_OPTION.routes.map(e => e.path),
}