import React from 'react'
import { Layout } from 'antd'
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons'
import { APPNAME } from '@/constants'
import './index.scss'
import { doLogout } from '@/utils'
import { useAppSelector } from '@/stores'
import { userInfo } from '@/stores/user'

const { Header } = Layout

const CustomHeader = () => {
  const { username } = useAppSelector(userInfo);

  if (username?.role !== 1) {
    return null
  }

  return (
    <Header className="layout-header">
      <div className="u-left-menu">
        <span className="u-app-name">
          {APPNAME}
        </span>
      </div>
      <div className="u-right-menu">
        <div className="u-item">
          <UserOutlined className="u-icon" />
          <span className="u-text">
            欢迎您，
            {username || 'admin'}
          </span>
        </div>
        <div className="u-item u-logout" onClick={doLogout}>
          <PoweroffOutlined className="u-icon" />
          <span className="u-text">
            退出
          </span>
        </div>
      </div>
    </Header>
  )
}

export default CustomHeader
