

import React from 'react'
import {
  Route,
  RouteObject,
} from 'react-router-dom'

interface IRouteWrapProps {
  route: RouteObject;
}

const RouterComponent = (props: IRouteWrapProps) => {
  const { route } = props
  const { element, Component, children } = route
  let ele = element
  if (Component) {
    ele = <Component routes={children} />
  }
  return ele
}

const routeList = (routeConfig: RouteObject[]) => routeConfig.map((route: RouteObject) => {
  return (
    <Route path={route.path} element={<RouterComponent route={route} />} key={route.path} >
      {
        route.children?.map(e => (
          <Route path={e.path} element={<RouterComponent route={e} />} key={e.path} />
        ))
      }
    </Route>
  )
})

export default routeList
