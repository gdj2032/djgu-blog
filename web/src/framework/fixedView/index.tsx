/*
 * @Author: djgu djgu@tmindtech.com
 * @Date: 2023-07-20 14:24:19
 * @LastEditors: djgu djgu@tmindtech.com
 * @LastEditTime: 2023-10-12 14:03:20
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import { useAppSelector, sysAction } from '@/stores';
import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MenuModal from '../menuModal';
import './index.scss';

interface IProps {
  menuShow?: boolean;
  modeShow?: boolean;
}

function FixedView(props: IProps) {
  const { menuShow = true, modeShow = true } = props;
  // const dispatch = useDispatch()
  // const sysInfo = useAppSelector(sysAction.sysInfo)
  const [visible, setVisible] = useState<boolean>(false)
  // let timer
  return (
    <div className='g-fixed-view'>
      {menuShow && (
        <Button className='menu-button' onClick={() => setVisible(true)}>
          <MenuOutlined />
        </Button>
      )}
      {/* {modeShow && (
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
      )} */}
      <MenuModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </div>
  )
}

FixedView.displayName = 'FixedView';

export default FixedView;
