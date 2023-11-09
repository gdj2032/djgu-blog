/**
 * 左侧导航栏
 */
import { USER_ROLE } from '@/constants';
import { Layout, Menu, Tooltip } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.scss';
import { PathConfig } from '../routes/routes';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { RouteService } from '@/typings/route';
import { tabRouteAction, useAppSelector } from '@/stores';
import { useDispatch } from 'react-redux';

const { Sider } = Layout;

interface IMenu extends RouteService.IListData {
  label: string;
  key: string;
  children: IMenu[]
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
  let result = ''
  for (let i = 0, len = config.length; i < len; i++) {
    const menu = config[i]
    if (menu.children) {
      result = findSelectedKey(key, menu.children)
      if (result) {
        break
      }
    } else if (key.startsWith(menu.key)) {
      result = menu.key
      break
    }
  }
  return result
}

function Aside(props: IProps) {
  const df = (list: RouteService.IListData[]) => {
    return list?.map(e => ({ ...e, label: e.name, key: e.path, children: df(e.children) }))
  }

  const history = useNavigate()
  const location = useLocation()
  const { routes } = useAppSelector(tabRouteAction.tabRouteInfo)
  const [selectedKey, changeSelectedKeys] = useState(location.pathname)
  const [inlineCollapsed, setInlineCollapsed] = useState(false)
  const [menus, setMenus] = useState<IMenu[]>(df(routes))
  const dispatch = useDispatch()

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
    const currentSelectedKey = findSelectedKey(location.pathname, menus)
    const curMenu = menus.find(e => e.key === currentSelectedKey)
    dispatch(tabRouteAction.setCurrentRoute(curMenu))
    changeSelectedKeys(currentSelectedKey)
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
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        onClick={(changeRouteHandle)}
        items={menus}
        inlineCollapsed={inlineCollapsed}
      />
    </Sider>
  )
}

Aside.displayName = 'Aside';

export default Aside;
