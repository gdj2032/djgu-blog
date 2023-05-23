/**
 * 新增编辑文档类型
 */
import { Form, Input, message, Modal, Button } from 'antd';
import React, { useState } from 'react';
import { IModalProps } from '@djgu/react-comps/dist/utils/openModal'
import { documentTypeService } from '@/services';
import { CUpload } from '@/components';
import { UploadOutlined } from '@ant-design/icons';
import { API_HOST } from '@/constants';
import { DocumentTypeService } from '@/typings/documentType';

interface IProps extends IModalProps {
  data?: DocumentTypeService.IListData;
}

function UpdateDocTypeModal(props: IProps) {
  const { visible, close, data, ...arg } = props;
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  let formRef;

  const handleOk = async () => {
    const params = await formRef?.validateFields();
    setLoading(true)
    try {
      if (data) {
        const res = await documentTypeService.dtEdit(data.id, {
          name: params.name,
          description: params.description
        });
        if (res?.code === 200) {
          message.success('编辑成功')
          close?.(true)
        }
      } else {
        const res = await documentTypeService.dtCreate({
          name: params.name,
          description: params.description
        });
        console.log("🚀 ~ file: UpdateDocTypeModal.tsx:30 ~ handleOk ~ res", res)
        if (res?.code === 200) {
          message.success('新增成功')
          close?.(true)
        }
      }
    } catch (error) {
      console.log("🚀 ~ file: UpdateDocTypeModal.tsx:49 ~ handleOk ~ error:", error)
    }
    setLoading(false)
  }

  const uploadParams = {
    action: `${API_HOST}/file/upload`,
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        setLoading(false);
        setImageUrl(info.file?.response?.data?.url);
        return;
      }
      if (info.file.status === 'error') {
        setLoading(false);
        message.error('上传失败')
      }
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => close()}
      onOk={handleOk}
      title={data ? '编辑文档类型' : '新增文档类型'}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      {...arg}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        ref={c => formRef = c}
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
          label="描述"
          name="description"
          className='text-area-resize-none'
        >
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        {/* <Form.Item
          label="图片"
          name="imageUrl"
          rules={[{ required: true, message: '请选择图片' }]}
        >
          <CUpload {...uploadParams}>
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </CUpload>
        </Form.Item> */}
      </Form>
    </Modal>
  )
}

UpdateDocTypeModal.displayName = 'UpdateDocTypeModal';

export default UpdateDocTypeModal;
