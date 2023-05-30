import React, { useState, useEffect, useRef } from 'react';
import { TBreadcrumb } from '@/components';
import './index.scss';
import { PathConfig } from '@/framework/routes/routes';
import { USER_ROLE, USER_TAB } from '@/constants';
import { Card, Form, Input, Select, message, Space, Button } from 'antd';
import { documentTypeService, documentService, fileService } from '@/services';
import Editor from 'for-editor'
import { IRowItem } from '@/components/ItemsRow';
import { useNavigate } from 'react-router';
import { useQuery, openModal2 } from '@djgu/react-comps';
import { DocumentService } from '@/typings/document';
import UpdateDocTypeModal from '../user/comps/UpdateDocTypeModal';
import { fileUuid, uploadFile } from '@/utils';

function Create() {
  const { id } = useQuery()
  const navigate = useNavigate()
  const [types, setTypes] = useState<IIdName[]>([])
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<any>();
  const formRef = useRef<any>();
  const [, setData] = useState<DocumentService.IListData>()

  const routes = [
    { name: '管理员', url: `${PathConfig.user}?current=${USER_TAB.document}` },
    { name: id ? '编辑文档' : '新增文档' },
  ]

  const handleSubmit = async () => {
    const params = await formRef.current.validateFields();
    try {
      setLoading(true)
      const { data } = await uploadFile({ content: params.content })
      const fileId = data.id;
      if (id) {
        const res = await documentService.dEdit(id, {
          name: params.name,
          description: params.description,
          types: params.types,
          fileId,
        })
        if (res.code === 200) {
          message.success('编辑文档成功')
          navigate(`${PathConfig.user}?current=${USER_TAB.document}`)
        }
      } else {
        const res = await documentService.dCreate({
          name: params.name,
          description: params.description,
          types: params.types,
          fileId,
        })
        if (res.code === 200) {
          message.success('新增文档成功')
          navigate(`${PathConfig.user}?current=${USER_TAB.document}`)
        }
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

  const initDoc = async () => {
    if (id) {
      const res = await documentService.dDetail(id);
      setData(res.data)
      console.info('--- formRef --->', formRef.current);
      formRef.current?.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        types: res.data.types.map((e) => e.id),
        // content: res.data.content,
      })
    }
  }

  useEffect(() => {
    initDoc()
    initTypes()
  }, [])

  if (!USER_ROLE.isAdminForSelf()) {
    return <div>暂无权限</div>
  }

  const addImg = async (file) => {
    const formData = new FormData();
    formData.set('file', file)
    formData.set('name', file.name)
    formData.set('type', file.type)
    const res = await fileService.upload(formData);
    if (res.code === 200) {
      editorRef.current.$img2Url(file.name, res.data.url)
    }
  }

  const handleAddType = () => {
    const { destroy } = openModal2(UpdateDocTypeModal, {
      afterClose: () => {
        initTypes()
        destroy()
      }
    })
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
            <Input.TextArea placeholder="请输入描述" rows={5} maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            label="文档类型"
            className="ant-form-label-point-show"
          >
            <Space>
              <Form.Item
                name="types"
                noStyle
                rules={[
                  { required: true, message: '请选择文档类型' }
                ]}
              >
                <Select
                  style={{ width: 240 }}
                  options={types}
                  mode="multiple"
                  fieldNames={{ label: 'name', value: 'id' }}
                  optionFilterProp="name"
                  allowClear
                  showSearch
                  placeholder="请选择文档类型"
                />
              </Form.Item>
              <Button type="link" onClick={handleAddType}>新增类型</Button>
            </Space>
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
