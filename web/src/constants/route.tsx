import { USER_ROLE } from ".";

export const DEFAULT_ROUTE_OPTION = {
  routes: [
    {
      id: '1',
      name: '首页',
      path: '/home',
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