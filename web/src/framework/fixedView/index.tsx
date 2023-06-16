/**
 * fix ui
 */
import { Icon } from '@/components';
import { useAppSelector, sysAction } from '@/stores';
import { MenuOutlined } from '@ant-design/icons';
import { Button, Switch } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import './index.scss';

interface IProps {
  menuShow?: boolean;
  modeShow?: boolean;
}

function FixedView(props: IProps) {
  const { menuShow = true, modeShow = true } = props;
  const dispatch = useDispatch()
  const sysInfo = useAppSelector(sysAction.sysInfo)
  return (
    <div className='g-fixed-view'>
      {menuShow && (
        <Button className='menu-button'>
          <MenuOutlined />
        </Button>
      )}
      {modeShow && (
        <Switch
          checked={sysInfo.mode === 'light'}
          className='mode-switch'
          checkedChildren={<div className='mode-switch-child'><Icon name="light" fill='#fff' /></div>}
          unCheckedChildren={<div className='mode-switch-child'><Icon name="dark" fill='#fe1' /></div>}
          onChange={(e) => {
            dispatch(sysAction.setMode(e ? 'light' : 'dark'))
          }}
        />
      )}
    </div>
  )
}

FixedView.displayName = 'FixedView';

export default FixedView;
