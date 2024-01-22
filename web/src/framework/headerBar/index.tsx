/**
 * 导航栏
 */
import { APPNAME } from '@/constants';
import { Button } from 'antd';
import React from 'react';
import './index.scss';

interface IProps {
}

function HeaderBar(props: IProps) {
  return (
    <div className='g-header-bar'>
      <div>{APPNAME}</div>
      <div className='m-btns'>
        <Button type='ghost'>主页</Button>
        <Button type='ghost'>工具</Button>
        <Button type='ghost'>前端</Button>
      </div>
    </div>
  )
}

HeaderBar.displayName = 'HeaderBar';

export default HeaderBar;
