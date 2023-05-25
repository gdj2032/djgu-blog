/**
 * 左侧导航栏
 */
import { INavFormat, menuConfig, USER_ROLE } from '@/constants';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.scss';
import { PathConfig } from '../routes/routes';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface IProps {
}

const isAncestorNode = (key: string, config: INavFormat[] = []) => {
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

const findSubMenuPath = (key: string, config: INavFormat[] = []) => {
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

const findSelectedKey = (key: string, config: INavFormat[] = []) => {
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
  const history = useNavigate()
  const location = useLocation()
  const [selectedKey, changeSelectedKeys] = useState(location.pathname)
  const [inlineCollapsed, setInlineCollapsed] = useState(true)

  const menus = menuConfig.filter((e) => e.admin ? USER_ROLE.isAdminForSelf() && e.admin : true).map((e) => ({ ...e, admin: undefined }))

  const [defaultOpenKeys] = useState(findSubMenuPath(location.pathname, menus))

  useEffect(() => {
    const currentSelectedKey = findSelectedKey(location.pathname, menus)
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
      <div className='aside-logo' onClick={() => {
        history(PathConfig.home)
      }}>
        GDJ
      </div>
      <a className="layout-aside-collapsed" onClick={() => setInlineCollapsed(!inlineCollapsed)} >
        {inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </a>
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
