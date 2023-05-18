import React from 'react'
import {
  Route
} from 'react-router-dom'
import { RouteObject } from 'react-router/dist/lib/context'

const routeList = (routeConfig: RouteObject[]): any => routeConfig.map((route: RouteObject) => {
  if (route.children) {
    return routeList(route.children)
  }
  return <Route path={route.path} element={route.element} key={route.path} />
})

export default routeList
