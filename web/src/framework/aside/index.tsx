/**
 * 左侧导航栏
 */
import { USER_ROLE } from '@/constants';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.scss';
import { RouteService } from '@/typings/route';
import { routeAction, sysAction, useAppSelector } from '@/stores';
import { useDispatch } from 'react-redux';

const { Sider } = Layout;

interface IMenu extends RouteService.IListData {
  label: string;
  key: string;
  children?: IMenu[]
}

interface IProps {
}

const isAncestorNode = (key: string, config: IMenu[] = []) => {
  if (!key || !config.length) {
    return false
  }
  for (let i = 0, len = config.length; i < len; i++) {
    const item = config[i]
    if (item.key === key || isAncestorNode(key, item.children)) {
      return true
    }
  }
  return false
}

const findSubMenuPath = (key: string, config: IMenu[] = []) => {
  let result: string[] = []
  for (let i = 0, len = config.length; i < len; i++) {
    const menu = config[i]
    if (isAncestorNode(key, menu.children)) {
      result = result.concat([menu.key], findSubMenuPath(key, menu.children))
      break
    }
  }
  return result
}

const findSelectedKey = (key: string, config: IMenu[] = []) => {
  let result: IMenu;
  for (let i = 0, len = config.length; i < len; i++) {
    const menu = config[i]
    if (menu.children) {
      result = findSelectedKey(key, menu.children)
      if (result) {
        break
      }
    } else if (key.startsWith(menu.key)) {
      result = menu
      break
    }
  }
  return result
}

function Aside(props: IProps) {
  const df = (list: RouteService.IListData[]) => {
    return list?.map(e => ({ ...e, label: e.name, key: e.path }))
  }

  const history = useNavigate()
  const location = useLocation()
  const { routes } = useAppSelector(routeAction.routeInfo)
  const [selectedKey, changeSelectedKeys] = useState(location.pathname)
  // const [inlineCollapsed, setInlineCollapsed] = useState(false)
  const [inlineCollapsed] = useState(false)
  const [menus, setMenus] = useState<IMenu[]>(df(routes))
  const dispatch = useDispatch()
  const sysInfo = useAppSelector(sysAction.sysInfo)

  useEffect(() => {
    const newRoutes2 = routes.filter((e) => !USER_ROLE.isAdmin(e.role));
    let newMenus = newRoutes2;
    if (USER_ROLE.isAdminForSelf()) {
      newMenus = routes
    }
    setMenus(df(newMenus))
  }, [routes])

  const [defaultOpenKeys] = useState(findSubMenuPath(location.pathname, menus))

  useEffect(() => {
    const currentSelectedMenu = findSelectedKey(location.pathname, menus)
    dispatch(routeAction.setCurrentRoute(currentSelectedMenu))
    changeSelectedKeys(currentSelectedMenu?.key)
  }, [location.pathname, menus])

  const changeRouteHandle = ({ key }) => {
    history(key)
  }

  return (
    <Sider
      width={inlineCollapsed ? 54 : 200}
      className="layout-aside"
    >
      {/* <Tooltip title="收缩" placement="right">
        <a className="layout-aside-collapsed" onClick={() => setInlineCollapsed(!inlineCollapsed)} >
          {inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </a>
      </Tooltip> */}
      <Menu
        theme={sysInfo.mode}
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        onClick={(changeRouteHandle)}
        items={menus}
      // inlineCollapsed={inlineCollapsed}
      />
    </Sider>
  )
}

Aside.displayName = 'Aside';

export default Aside;
