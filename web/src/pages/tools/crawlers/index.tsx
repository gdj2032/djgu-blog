import { TBreadcrumb } from '@/components';
import { PathConfig } from '@/framework/routes/routes';
import { crawlersService } from '@/services';
import { CrawlersService } from '@/typings/crawlers';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Card, Form, FormInstance, Input, InputNumber, Select, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

function Crawlers() {
  const [data, setData] = useState<CrawlersService.IListData[]>([])
  const formRef = useRef<FormInstance>(null);
  const route = [
    { name: '首页', url: PathConfig.home },
    { name: '工具', url: PathConfig.tools },
    { name: '爬虫' },
  ]

  const init = async () => {
    const res = await crawlersService.list({ limit: 10000, offset: 0 })
    setData(res.data.data)
  }

  useEffect(() => {
    init()

    formRef.current.setFieldsValue({
      id: '1697092786363466467',
      // 87_312_1_1 88_282_1_1
      url: 'https://www.tooopen.com/img/88_282_1_1.html',
      firstPage: 1,
      lastPage: 5,
    })
  }, [])

  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6, style: { minWidth: 400 } },
  };
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const base64ToBlob = (base64) => {
    let bstr = window.atob(base64),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: 'application/octet-stream' });
  }

  const handleFinish = async (values) => {
    const res = await crawlersService.download(values)
    console.log("🚀 ~ file: index.tsx:62 ~ handleFinish ~ res:", res)
    if (res.buffer) {
      const blob = base64ToBlob(arrayBufferToBase64(res.buffer.data))
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = res.name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  }
  return (
    <div className='g-crawlers'>
      <TBreadcrumb route={route} />
      <Card
        style={{ marginTop: 20 }}
        title={(
          <div>
            下载
            <Tooltip title='仅支持部分网站下载'>
              <ExclamationCircleFilled style={{ marginLeft: 4, color: '#ccc' }} />
            </Tooltip>
          </div>
        )}
      >
        {/* <Button onClick={init}>重置</Button> */}
        <Form
          {...formItemLayout}
          colon
          ref={c => formRef.current = c}
          onFinish={handleFinish}
        >
          <Form.Item name="id" label="网站" rules={[{ required: true, message: '请选择网站' }]}>
            <Select allowClear options={data} placeholder='请选择网站' fieldNames={{ label: 'name', value: 'id' }} />
          </Form.Item>
          <Form.Item name="url" label="具体地址" rules={[{ required: true, message: '请输入具体地址' }]}>
            <Input placeholder='请输入具体地址' />
          </Form.Item>
          <Form.Item label="页码" className='ant-form-label-point-show'>
            <Space.Compact>
              <Form.Item name="firstPage" rules={[{ required: true, message: '请输入起始页' }]}>
                <InputNumber placeholder='请输入起始页' precision={0} min={0} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="lastPage" rules={[{ required: true, message: '请输入起始页' }]}>
                <InputNumber placeholder='请输入最后一页' precision={0} min={0} style={{ width: 160 }} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 2, offset: 2 }}>
            <Button type="primary" htmlType="submit">下载</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

Crawlers.displayName = 'Crawlers';

export default Crawlers;
