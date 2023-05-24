import React, { useState, useEffect, useRef } from 'react';
import { TBreadcrumb } from '@/components';
import './index.scss';
import { PathConfig } from '@/framework/routes/routes';
import { USER_ROLE, USER_TAB } from '@/constants';
import { Card, Form, Input, Select, message } from 'antd';
import { documentTypeService, documentService } from '@/services';
import Editor from 'for-editor'
import { IRowItem } from '@/components/ItemsRow';
import { useNavigate } from 'react-router';

function Create() {
  const navigate = useNavigate()
  const [types, setTypes] = useState<IIdName[]>([])
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<any>();
  const formRef = useRef<any>();

  const routes = [
    { name: '管理员', url: `${PathConfig.user}?current=${USER_TAB.document}` },
    { name: '新增文档' },
  ]

  const handleSubmit = async () => {
    const params = await formRef.current.validateFields();
    setLoading(true)
    try {
      const res = await documentService.dCreate({
        name: params.name,
        description: params.description,
        types: params.types,
        content: params.content,
      })
      if (res.code === 200) {
        message.success('新增文档成功')
        navigate(`${PathConfig.user}?current=${USER_TAB.document}`)
      }
    } catch (error) {
      console.log("🚀 ~ file: create.tsx:39 ~ handleSubmit ~ error:", error)
    }
    setLoading(false)
  }

  const customItems: IRowItem[] = [
    {
      label: '提交',
      type: 'primary',
      onClick: handleSubmit,
      btnProps: {
        loading,
      }
    }
  ]

  const initTypes = async () => {
    const res = await documentTypeService.dtList({ limit: 10000, offset: 0 });
    setTypes(res.data.data)
  }

  useEffect(() => {
    initTypes()
  }, [])

  if (!USER_ROLE.isAdminForSelf()) {
    return <div>暂无权限</div>
  }

  const addImg = (file) => {
    editorRef.current.$img2Url('111', 'file_url')
  }
  return (
    <div className="g-document-create">
      <TBreadcrumb route={routes} customItems={customItems} />

      <Card title="基本信息" className="global-mgt-12">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          ref={c => formRef.current = c}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true, message: '请输入名称' }
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            className='text-area-resize-none'
          >
            <Input.TextArea placeholder="请输入描述" lineNumber={5} />
          </Form.Item>
          <Form.Item
            name="types"
            label="文档类型"
            rules={[
              { required: true, message: '请选择文档类型' }
            ]}
          >
            <Select
              options={types}
              mode="multiple"
              fieldNames={{ label: 'name', value: 'id' }}
              optionFilterProp="name"
              allowClear
              showSearch
              placeholder="请选择文档类型"
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="正文"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[
              { required: true, message: '请输入正文' }
            ]}
          >
            <Editor
              ref={c => editorRef.current = c}
              addImg={addImg}
              placeholder="请输入正文"
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

Create.displayName = 'Create';

export default Create;
