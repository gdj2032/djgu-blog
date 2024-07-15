import React, { useState, useEffect } from 'react';
import { QuillEditor, TBreadcrumb } from '@/components';
import './index.scss';
import { PathConfig } from '@/framework/routes/routes';
import { DEFAULT_ROUTE_OPTION, USER_ROLE, USER_TAB } from '@/constants';
import { Card, Form, Input, Select, message, Space, Button } from 'antd';
import { documentService, fileService, tagService } from '@/services';
import { IRowItem } from '@/components/ItemsRow';
import { useNavigate } from 'react-router';
import { useQuery, openModal2 } from '@djgu/react-comps';
import { DocumentService } from '@/typings/document';
import { initRoutes, uploadFile } from '@/utils';
import UpdateRouteModal from '../user/comps/UpdateRouteModal';
import { useForm } from "antd/es/form/Form";
import { routeAction, useAppSelector } from '@/stores';
import { TagService } from '@/typings/tag';
import UpdateTagModal from '../user/comps/UpdateTagModal';

function Create() {
  const { id } = useQuery()
  const navigate = useNavigate()
  const { routes: storeRoutes } = useAppSelector(routeAction.routeInfo)
  const [loading, setLoading] = useState(false)
  const [form] = useForm();
  const [, setData] = useState<DocumentService.IListData>()
  const [tags, setTags] = useState<TagService.IListData[]>([])
  const routeId = Form.useWatch('routeId', form)

  const routes = [
    { name: '管理员', url: `${PathConfig.admin}?current=${USER_TAB.document}` },
    { name: id ? '编辑文档' : '新增文档' },
  ]

  const handleSubmit = async () => {
    const params = await form.validateFields();
    try {
      setLoading(true)
      const { data } = await uploadFile({ content: params.content })
      const fileId = data.id;
      if (id) {
        const res = await documentService.dEdit(id, {
          name: params.name,
          description: params.description,
          routeId: params.routeId,
          fileId,
          tagIds: params.tagIds?.join(','),
        })
        if (res.code === 200) {
          message.success('编辑文档成功')
          navigate(`${PathConfig.admin}?current=${USER_TAB.document}`)
        }
      } else {
        const res = await documentService.dCreate({
          name: params.name,
          description: params.description,
          routeId: params.routeId,
          fileId,
          tagIds: params.tagIds?.join(','),
        })
        if (res.code === 200) {
          message.success('新增文档成功')
          navigate(`${PathConfig.admin}?current=${USER_TAB.document}`)
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

  const initDoc = async () => {
    if (id) {
      const res = await documentService.dDetail(id);
      setData(res.data)
      // console.info('--- formRef --->', formRef.current);
      const res1 = await fileService.getFile(res.data.fileId)
      // console.log("🚀 ~ file: detail.tsx:37 ~ init ~ res1:", res1)
      const fr = new FileReader()
      fr.addEventListener('loadend', (e: any) => {
        form?.setFieldsValue({ content: e.target.result })
      })
      fr.readAsText(res1)
      form?.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        routeId: res.data.route?.id,
        tagIds: res.data.tags?.map(e => e.id),
      })
    }
  }

  const initTags = async () => {
    if (!routeId) {
      setTags([])
      return
    }
    const res = await tagService.dList({ limit: 10000, offset: 0, routeId })
    setTags(res.data.data)
  }

  useEffect(() => {
    initDoc()
  }, [])

  useEffect(() => {
    initTags()
  }, [routeId])

  if (!USER_ROLE.isAdminForSelf()) {
    return <div>暂无权限</div>
  }

  const addImg = async (file) => {
    const formData = new FormData();
    formData.set('file', file)
    formData.set('name', file.name)
    formData.set('type', file.type)
    const res = await fileService.upload(formData);
    if (+res?.code === 200) {
      return { name: file.name, ...res.data }
    }
    return null;
  }

  const handleAddRoute = () => {
    const { destroy } = openModal2(UpdateRouteModal, {
      afterClose: () => {
        initRoutes()
        destroy()
      }
    })
  }

  const handleAddTag = () => {
    const { destroy } = openModal2(UpdateTagModal, {
      afterClose: () => {
        initTags()
        destroy()
      }
    })
  }

  const newRoutes = storeRoutes.filter(e => !DEFAULT_ROUTE_OPTION.routePaths().includes(e.path))

  return (
    <div className="g-document-create">
      <TBreadcrumb route={routes} customItems={customItems} />

      <Card title="基本信息" className="global-mgt-12">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          form={form}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true, message: '请输入名称, 字数不能超过30字', max: 30 }
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
            label="所属路由"
            className="ant-form-label-point-show"
          >
            <Space>
              <Form.Item
                name="routeId"
                noStyle
                rules={[
                  { required: true, message: '请选择所属路由' }
                ]}
              >
                <Select
                  style={{ width: 240 }}
                  options={newRoutes}
                  fieldNames={{ label: 'name', value: 'id' }}
                  optionFilterProp="name"
                  allowClear
                  showSearch
                  placeholder="请选择所属路由"
                />
              </Form.Item>
              <Button type="link" onClick={handleAddRoute}>新增路由</Button>
            </Space>
          </Form.Item>
          <Form.Item
            label="标签"
            className="ant-form-label-point-show"
          >
            <Space>
              <Form.Item
                name="tagIds"
                noStyle
                rules={[
                  { required: true, message: '请选择标签' }
                ]}
              >
                <Select
                  style={{ width: 240 }}
                  options={tags}
                  mode='multiple'
                  fieldNames={{ label: 'name', value: 'id' }}
                  optionFilterProp="name"
                  allowClear
                  showSearch
                  placeholder="请选择标签"
                />
              </Form.Item>
              <Button type="link" onClick={handleAddTag}>新增标签</Button>
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
            {/* <Editor
              ref={c => editorRef.current = c}
              addImg={addImg}
              placeholder="请输入正文"
              subfield
            /> */}
            <QuillEditor
              showToolbar
              syntax
              onUploadFile={async (files: any) => {
                const arr: { url: string, name: string }[] = []
                for (const file of files) {
                  const res = await addImg(file)
                  if (res) {
                    arr.push(res)
                  }
                }
                return arr;
              }}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

Create.displayName = 'Create';

export default Create;
