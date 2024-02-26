/**
 * 设置弹窗
 */
import { BOOK_FONT_SIZE } from '@/constants';
import { bookAction, useAppSelector } from '@/stores';
import { Button, ColorPicker, Drawer, InputNumber, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './index.scss';

interface IProps {
  open: boolean;
  close?: () => void;
  onReset?: () => void;
}

function SetModal(props: IProps) {
  const { open, close, onReset } = props;
  const dispatch = useDispatch()
  const { setting } = useAppSelector(bookAction.bookInfo)

  const [setCfg, setSetCfg] = useState(setting)

  const setConfigs = [
    {
      label: '字号',
      value: (
        <InputNumber
          value={setting.fontSize}
          style={{ width: 160 }}
          {...BOOK_FONT_SIZE}
          onChange={v => {
            setSetCfg({ ...setCfg, fontSize: v })
          }}
        />
      ),
    },
    {
      label: '背景色',
      value: (
        <ColorPicker
          value={setting.background}
          onChange={(v) => {
            setSetCfg({ ...setCfg, background: v.toRgbString() })
          }}
        />
      )
    }
  ]
  return (
    <Drawer
      open={open}
      placement='left'
      title='阅读设置'
      onClose={close}
      getContainer={false}
      className='m-set-modal'
      footer={
        <Row justify='end'>
          <Button
            onClick={() => {
              dispatch(bookAction.setSetting(setCfg))
              close()
              onReset()
            }}
            type="primary"
            className='global-mgr-20'
          >确定</Button>
          <Button onClick={close}>取消</Button>
        </Row>
      }
    >
      {
        setConfigs.map(e => (
          <div className='p-set-item' key={e.label}>
            <div className='i-label'>{e.label}</div>
            <div className='i-value'>{e.value}</div>
          </div>
        ))
      }
    </Drawer>
  )
}

SetModal.displayName = 'SetModal';

export default SetModal;
