/**
 * 是否启用下雪动画
 */
import { useAppSelector, sysAction } from '@/stores';
import React from 'react';
import { useDispatch } from 'react-redux';
import CSwitch from '../CSwitch';
import Icon from '../Icon';
import './index.scss';

interface IProps {
  title?: string;
}

function SnowSwitch(props: IProps) {
  const { title } = props;
  const { snow } = useAppSelector(sysAction.sysInfo)
  const dispatch = useDispatch()

  return (
    <div className='SnowSwitch'>
      <span>{title}</span>
      <CSwitch
        size={{ width: 32, height: 16 }}
        className='mode-switch'
        checked={snow}
        checkCircle={<Icon name="snow" fill='rgba(59, 60, 108, 1)' />}
        uncheckedCircle={<Icon name="snow" fill='rgba(222, 222, 222, 1)' />}
        checkedBg='rgba(193, 252, 255, 1)'
        uncheckedBg='rgba(68, 87, 129, 1)'
        checkedCircleBg='rgba(180, 200, 222, 1)'
        uncheckedCircleBg='rgba(26, 39, 68, 1)'
        onChange={(e) => {
          dispatch(sysAction.setSnow(!snow))
        }}
      />
    </div>
  )
}

SnowSwitch.displayName = 'SnowSwitch';

export default SnowSwitch;
