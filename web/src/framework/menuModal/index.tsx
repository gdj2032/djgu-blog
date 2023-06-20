/**
 * 左侧目录弹窗
 */
import { INavFormat } from '@/constants';
import { useAppSelector, userAction } from '@/stores';
import { doLogout } from '@/utils';
import { CloseOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Drawer, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import { PathConfig } from '../routes/routes';
import './index.scss';

interface IItem extends INavFormat {
  click?: () => void;
}

interface IProps {
  visible: boolean;
  onClose?: () => void;
}

function MenuModal(props: IProps) {
  const { visible, onClose } = props;
  const user = useAppSelector(userAction.userInfo)
  const navigate = useNavigate()

  const bottomMenu = () => {
    const items: IItem[] = [
      {
        label: '首页',
        key: PathConfig.home,
        icon: <HomeOutlined />
      },
      {
        label: '管理',
        key: user.id ? PathConfig.user : PathConfig.login,
        icon: <UserOutlined />
      },
    ]
    if (user.id) {
      items.push(
        {
          label: '退出登录',
          key: PathConfig.login,
          click: () => doLogout(),
          icon: <LogoutOutlined />
        }
      )
    }
    return items;
  }

  const menus: IItem[] = [
    { label: '最近更新', key: PathConfig.latest },
    { label: '所有文档', key: PathConfig.document },
  ]
  return (
    <Drawer
      open={visible}
      onClose={onClose}
      placement='left'
      closable={false}
      title={(
        <Row justify='space-between'>
          <div>欢迎访问~</div>
          <CloseOutlined onClick={onClose} className='global-cursor-pointer' />
        </Row>
      )}
      className="g-menu-drawer"
    >
      <div className='m-menu-body'>
        {
          menus.map(e => (
            <div
              key={e.label}
            >
              <span
                className='p-mbd-item'
                key={e.label}
                onClick={() => {
                  if (e.click) {
                    e.click();
                  } else {
                    navigate(e.key)
                  }
                  onClose?.()
                }}
              >
                {e.label}
              </span>
            </div>
          ))
        }
      </div>
      <div className='m-menu-bottom'>
        {
          bottomMenu().map(e => (
            <div
              key={e.key}
              className='p-mb-item'
              onClick={() => {
                if (e.click) {
                  e.click();
                } else {
                  navigate(e.key)
                }
                onClose?.()
              }}
            >
              {e.icon}
              <span>{e.label}</span>
            </div>
          ))
        }
      </div>
    </Drawer>
  )
}

MenuModal.displayName = 'MenuModal';

export default MenuModal;
