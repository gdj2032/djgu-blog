/**
 * 新增编辑文档类型
 */
import { Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { IModalProps } from '@djgu/react-comps/dist/utils/openModal'
import { routeService } from '@/services';
import { useForm } from 'antd/es/form/Form';
import { RouteService } from '@/typings/route';

interface IProps extends IModalProps {
  data?: RouteService.IListData;
}

function UpdateRouteModal(props: IProps) {
  const { visible, close, data, ...arg } = props;
  const [loading, setLoading] = useState(false)
  const [form] = useForm()
  const [parRoutes, setParRoutes] = useState<RouteService.IListData[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const res = await routeService.dList({ limit: 10000, offset: 0, onlyParent: true })
    setParRoutes(res.data.data)
  }

  const handleOk = async () => {
    const params = await form?.validateFields();
    setLoading(true)
    try {
      if (data) {
        const res = await routeService.dEdit(data.id, params);
        if (res?.code === 200) {
          message.success('编辑成功')
          close?.(true)
        }
      } else {
        const res = await routeService.dCreate(params);
        if (res?.code === 200) {
          message.success('新增成功')
          close?.(true)
        }
      }
    } catch (error) {
      console.log("🚀 ~ file: UpdateRouteModal.tsx:49 ~ handleOk ~ error:", error)
    }
    setLoading(false)
  }

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      onOk={handleOk}
      title={data ? '编辑路由配置' : '新增路由配置'}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      {...arg}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={data}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }, { max: 20, message: '名称长度不能超过20字' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="路由"
          name="path"
          rules={[{ required: true, message: '请输入路由' }]}
        >
          <Input placeholder="请输入路由" />
        </Form.Item>
        <Form.Item
          label="父路由"
          name="father_id"
        >
          <Select placeholder="请选择父路由" popupMatchSelectWidth options={parRoutes} fieldNames={{ label: 'name', value: 'id' }} optionFilterProp='name' allowClear showSearch />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          className='text-area-resize-none'
        >
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

UpdateRouteModal.displayName = 'UpdateRouteModal';

export default UpdateRouteModal;
