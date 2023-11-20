import React from 'react'
import { Layout, Tooltip } from 'antd'
import { GithubOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { APPNAME, isElectron, USER_ROLE } from '@/constants'
import './index.scss'
import { doLogout } from '@/utils'
import { sysAction, useAppSelector } from '@/stores'
import { userInfo } from '@/stores/user'
import { GITHUB_KNOWLEDGE_URL } from '@/pages/knowledge/constants'
import { useNavigate } from 'react-router'
import { PathConfig } from '../routes/routes'
import { CSwitch, Icon, Loading } from '@/components'
import { useDispatch } from 'react-redux'

const { Header } = Layout

const CustomHeader = () => {
  const { username, role } = useAppSelector(userInfo);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const sysInfo = useAppSelector(sysAction.sysInfo)

  const Comp: any = isElectron ? 'div' : 'a'
  let timer

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
        <div className='u-item'>
          <CSwitch
            size={{ width: 54 }}
            className='mode-switch'
            checked={sysInfo.mode === 'light'}
            checkCircle={<Icon name="light" fill='rgba(242, 230, 96, 1)' />}
            uncheckedCircle={<Icon name="dark" fill='rgba(146, 196, 255, 1)' />}
            checkedBg='rgba(188, 236, 244, 1)'
            uncheckedBg='rgba(68, 87, 129, 1)'
            checkedCircleBg='rgba(180, 200, 222, 1)'
            uncheckedCircleBg='rgba(26, 39, 68, 1)'
            onChange={(e) => {
              Loading.show()
              dispatch(sysAction.setMode(e ? 'light' : 'dark'))
              timer = setTimeout(() => {
                Loading.hide()
                clearTimeout(timer)
              }, 500);
            }}
          />
        </div>
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
        {
          USER_ROLE.isAdmin(role) && (
            <div className="u-item u-login">
              <Tooltip title='管理员'>
                <SettingOutlined onClick={() => navigate(PathConfig.admin)} />
              </Tooltip>
            </div>
          )
        }
        <div className="u-item u-login">
          <Tooltip title='大纲' >
            <Icon name='outline' onClick={() => navigate(PathConfig.knowledge)} />
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
