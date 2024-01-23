/**
 * 导航栏
 */
import { CSwitch, Icon, Loading } from '@/components';
import { APPNAME, isElectron, USER_ROLE } from '@/constants';
import { GITHUB_KNOWLEDGE_URL } from '@/pages/knowledge/constants';
import { useAppSelector, routeAction, userAction, sysAction } from '@/stores';
import { doLogout } from '@/utils';
import { BookOutlined, UserOutlined, LogoutOutlined, LoginOutlined, SettingOutlined, GithubOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import Logo from '../logo';
import { PathConfig } from '../routes/routes';
import './index.scss';

interface IProps {
}

function HeaderBar(_: IProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { routes } = useAppSelector(routeAction.routeInfo)
  const sysInfo = useAppSelector(sysAction.sysInfo)
  const { username, role } = useAppSelector(userAction.userInfo);
  const [selectedKey, changeSelectedKeys] = useState(location.pathname)

  const dispatch = useDispatch()

  const Comp: any = isElectron ? 'div' : 'a'
  let timer

  const handleGithub = () => {
    if (isElectron) {
      window.app.openUrl(GITHUB_KNOWLEDGE_URL)
    }
  }
  return (
    <div className='g-header-bar'>
      <div className='m-logo-bar'>
        <div className='p-logo'>
          <Logo />
        </div>
        <div className='p-bar'>
          {
            routes?.map(e => (
              <div
                key={e.path}
                className='i-btn'
                onClick={() => { navigate(e.path) }}>
                {e.name}
              </div>
            ))
          }
        </div>
      </div>

      <div className='m-set-bar'>
        <div className='u-item'>
          <CSwitch
            size={{ width: 32, height: 16 }}
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
          isElectron && (
            <div className="u-item u-login">
              <Tooltip title='小说'>
                <BookOutlined className="u-icon" />
              </Tooltip>
            </div>
          )
        }
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
        <div className="u-item u-logout">
          <Tooltip title='github'>
            <Comp className='m-github' href={GITHUB_KNOWLEDGE_URL} target='_blank' rel="noreferrer" onClick={handleGithub}>
              <GithubOutlined className='m-github-icon' />
            </Comp>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

HeaderBar.displayName = 'HeaderBar';

export default HeaderBar;
