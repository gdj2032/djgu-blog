/**
 * 新增编辑标签
 */
import { Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { IModalProps } from '@djgu/react-comps/dist/utils/openModal'
import { routeService, tagService } from '@/services';
import { useForm } from 'antd/es/form/Form';
import { TagService } from '@/typings/tag';
import { RouteService } from '@/typings/route';

interface IProps extends IModalProps {
  data?: TagService.IListData;
}

function UpdateTagModal(props: IProps) {
  const { visible, close, data, ...arg } = props;
  const [loading, setLoading] = useState(false)
  const [form] = useForm()

  const [parRoutes, setParRoutes] = useState<RouteService.IListData[]>([])
  const [allTags, setAllTags] = useState<TagService.IListData[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const res1 = await routeService.dList({ limit: 10000, offset: 0 })
    const res2 = await tagService.dList({ limit: 10000, offset: 0 })
    setParRoutes(res1?.data?.data)
    setAllTags(res2?.data?.data)
  }

  const handleOk = async () => {
    const params = await form?.validateFields();
    setLoading(true)
    try {
      if (data) {
        const res = await tagService.dEdit(data.id, params);
        if (res?.code === 200) {
          message.success('编辑成功')
          close?.(true)
        }
      } else {
        const res = await tagService.dCreate(params);
        if (res?.code === 200) {
          message.success('新增成功')
          close?.(true)
        }
      }
    } catch (error) {
      console.log("🚀 ~ file: UpdateTagModal.tsx:49 ~ handleOk ~ error:", error)
    }
    setLoading(false)
  }

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      onOk={handleOk}
      title={data ? '编辑标签配置' : '新增标签配置'}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      {...arg}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{
          ...data,
          routeId: data?.route?.id,
          parentTagId: data?.parentTag?.id,
        }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }, { max: 50, message: '名称长度不能超过20字' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="路由"
          name="routeId"
          rules={[{ required: true, message: '请选择路由' }]}
        >
          <Select placeholder="请选择路由" popupMatchSelectWidth options={parRoutes} fieldNames={{ label: 'name', value: 'id' }} optionFilterProp='name' allowClear showSearch />
        </Form.Item>
        <Form.Item
          label="父标签"
          name="parentTagId"
        >
          <Select placeholder="请选择父标签" popupMatchSelectWidth options={allTags} fieldNames={{ label: 'name', value: 'id' }} optionFilterProp='name' allowClear showSearch />
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

UpdateTagModal.displayName = 'UpdateTagModal';

export default UpdateTagModal;
