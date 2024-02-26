/**
 * 设置弹窗
 */
import { BOOK_FONT_SIZE, BOOK_LINE_HEIGHT } from '@/constants';
import { bookAction, useAppSelector } from '@/stores';
import { Button, ColorPicker, Drawer, InputNumber, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
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

  const [setCfg, setSetCfg] = useState({ ...setting, lineHeight: setting.lineHeight - setting.fontSize })

  useEffect(() => {
    if (open) {
      setSetCfg({ ...setting, lineHeight: setting.lineHeight - setting.fontSize })
    }
  }, [open])

  const setConfigs = () => [
    {
      id: 1,
      label: '字号',
      value: (
        <InputNumber
          value={setCfg.fontSize}
          style={{ width: 160 }}
          {...BOOK_FONT_SIZE}
          onChange={v => {
            setSetCfg({ ...setCfg, fontSize: v })
          }}
        />
      ),
    },
    {
      id: 2,
      label: '背景色',
      value: (
        <ColorPicker
          value={setCfg.background}
          onChangeComplete={(v) => {
            setSetCfg({ ...setCfg, background: `#${v.toHex()}` })
          }}
        />
      )
    },
    {
      id: 3,
      label: '字体颜色',
      value: (
        <ColorPicker
          value={setCfg.color}
          onChangeComplete={(v) => {
            setSetCfg({ ...setCfg, color: `#${v.toHex()}` })
          }}
        />
      )
    },
    {
      id: 4,
      label: <Tooltip title='实际行高 = 字号+行间距'>行间距</Tooltip>,
      value: (
        <InputNumber
          value={setCfg.lineHeight}
          style={{ width: 160 }}
          {...BOOK_LINE_HEIGHT}
          onChange={v => {
            setSetCfg({ ...setCfg, lineHeight: v })
          }}
        />
      ),
    },
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
              dispatch(bookAction.setSetting({ ...setCfg, lineHeight: setCfg.fontSize + setCfg.lineHeight }))
              close()
              setTimeout(() => {
                onReset()
              }, 500);
            }}
            type="primary"
            className='global-mgr-20'
          >确定</Button>
          <Button onClick={close}>取消</Button>
        </Row>
      }
    >
      {
        setConfigs().map(e => (
          <div className='p-set-item' key={e.id}>
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
