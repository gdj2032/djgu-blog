/**
 * 左侧目录弹窗
 */
import { Icon } from '@/components';
import pageRoutes from '@/pages/pageRoutes';
import { useAppSelector, userAction } from '@/stores';
import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import './index.scss';

interface IProps {
  visible: boolean;
  onClose?: () => void;
}

function MenuModal(props: IProps) {
  const { visible, onClose } = props;
  const user = useAppSelector(userAction.userInfo)
  const navigate = useNavigate()

  const bottomMenu = () => [
    {
      label: '首页',
      key: pageRoutes.home,
      icon: <Icon name="home" fill="#fff" size={14} />
    },
    {
      label: '管理',
      key: user.id ? pageRoutes.user : pageRoutes.login,
      icon: <Icon name="admin" fill="#fff" size={14} />
    },
  ]
  return (
    <Drawer
      open={visible}
      // open
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
      <div className='m-menu-body'>MenuModal</div>
      <div className='m-menu-bottom'>
        {
          bottomMenu().map(e => (
            <div key={e.key} className='p-mb-item' onClick={() => { navigate(e.key); onClose?.() }}>
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
