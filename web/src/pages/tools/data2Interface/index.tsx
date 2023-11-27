/**
 * 数据转接口
 */
import { CodeMirror, TBreadcrumb } from '@/components';
import { PathConfig } from '@/framework/routes/routes';
import { toolsService } from '@/services';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Card, message, Tooltip } from 'antd';
import React, { useState } from 'react';
import './index.scss';

function Data2Interface() {
  const route = [
    { name: '首页', url: PathConfig.home },
    { name: '工具', url: PathConfig.tools },
    { name: '数据转接口' },
  ]

  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState()

  const handleChange = async () => {
    try {
      if (value1) {
        const jsonData = JSON.parse(value1)
        if (typeof jsonData !== 'object') {
          message.error('数据格式错误')
          return
        }
        const res = await toolsService.data2Interface(jsonData)
        if (res?.code === 200) {
          message.success('转换成功')
          setValue2(res.data)
        }
      }
    } catch (error) {
      console.info('--- handleChange error --->', error);
      if (error?.includes('SyntaxError')) {
        message.error('数据格式错误')
      }
    }
  }

  const handleCopy = () => {
    if (value2) {
      navigator.clipboard?.writeText?.(value2)
      message.success('复制成功')
    }
  }
  return (
    <div className='g-data2interface'>
      <TBreadcrumb
        route={route}
        customItems={[
          { label: '转换', onClick: handleChange },
          { label: '复制', onClick: handleCopy }
        ]}
      />
      <Card
        title={<Tooltip title='{ "a": "a" } 必须符合json格式'>数据 <QuestionCircleFilled /></Tooltip>}
        style={{ marginTop: 20 }}
      >
        <CodeMirror id='code-mirror-1' value={value1} onChange={setValue1} />
      </Card>
      <Card title='接口' style={{ marginTop: 20 }}>
        <CodeMirror id='code-mirror-2' value={value2} />
      </Card>
    </div>
  )
}

Data2Interface.displayName = 'Data2Interface';

export default Data2Interface;
