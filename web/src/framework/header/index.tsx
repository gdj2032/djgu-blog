import React from 'react'
import { Layout, Tooltip } from 'antd'
import { GithubOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { APPNAME, isElectron } from '@/constants'
import './index.scss'
import { doLogout } from '@/utils'
import { useAppSelector } from '@/stores'
import { userInfo } from '@/stores/user'
import { GITHUB_KNOWLEDGE_URL } from '@/pages/knowledge/constants'
import { useNavigate } from 'react-router'
import { PathConfig } from '../routes/routes'

const { Header } = Layout

const CustomHeader = () => {
  const { username, role } = useAppSelector(userInfo);
  const navigate = useNavigate()

  const Comp: any = isElectron ? 'div' : 'a'

  const handleGithub = () => {
    if (isElectron) {
      window.app.openUrl(GITHUB_KNOWLEDGE_URL)
    }
  }

  return (
    <Header className="layout-header">
      <div className="u-left-menu">
        <span className="u-app-name">
          {APPNAME}
        </span>
      </div>
      <div className="u-right-menu">
        {
          username && (
            <div className="u-item">
              <UserOutlined className="u-icon" />
              <span className="u-text">
                欢迎您，
                {username}
              </span>
            </div>
          )
        }
        <div className="u-item u-login">
          <Tooltip title={username ? '登出' : '登录'}>
            {
              username ? <LogoutOutlined onClick={() => doLogout()} /> : <LoginOutlined onClick={() => navigate(PathConfig.login)} />
            }
          </Tooltip>
        </div>
        <div className="u-item u-logout" onClick={() => doLogout()}>
          <Tooltip title='github'>
            <Comp className='m-github' href={GITHUB_KNOWLEDGE_URL} target='_blank' rel="noreferrer" onClick={handleGithub}>
              <GithubOutlined className='m-github-icon' />
            </Comp>
          </Tooltip>
        </div>
      </div>
    </Header>
  )
}

export default CustomHeader
