/**
 * 新增编辑版本
 */
import { Button, Form, Input, message, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { IModalProps } from '@djgu/react-comps/dist/utils/openModal'
import { versionService } from '@/services';
import { VersionService } from '@/typings/version';
import { CUpload } from '@/components';
import { UploadOutlined } from '@ant-design/icons';
import { VERSION_TYPE } from '@/constants';

interface IProps extends IModalProps {
  data?: VersionService.IListData;
}

function UpdateVersionModal(props: IProps) {
  const { visible, close, data, ...arg } = props;
  const [loading, setLoading] = useState(false)
  // const [imageUrl, setImageUrl] = useState('')

  let formRef;

  const handleOk = async () => {
    const params = await formRef?.validateFields();
    const zipPath = params.zipPath.file?.response?.data?.url;
    if (!zipPath) {
      message.error('请上传项目压缩包')
      return
    }
    setLoading(true)
    try {
      if (data) {
        // const res = await versionService.versionEdit(data.id, {
        //   name: params.name,
        //   type: params.type,
        //   zipPath: zipPath,
        // });
        // if (res?.code === 200) {
        //   message.success('编辑成功')
        //   close?.(true)
        // }
      } else {
        const res = await versionService.versionCreate({
          name: params.name,
          type: params.type,
          zipPath: zipPath,
        });
        console.log("🚀 ~ file: UpdateVersionModal.tsx:30 ~ handleOk ~ res", res)
        if (res?.code === 200) {
          message.success('新增成功')
          close?.(true)
        }
      }
    } catch (error) {
      console.log("🚀 ~ file: UpdateVersionModal.tsx:49 ~ handleOk ~ error:", error)
    }
    setLoading(false)
  }

  // const uploadParams = {
  //   action: `${API_HOST}/file/upload`,
  //   onChange: (info) => {
  //     if (info.file.status === 'uploading') {
  //       setLoading(true);
  //       return;
  //     }
  //     if (info.file.status === 'done') {
  //       setLoading(false);
  //       setImageUrl(info.file?.response?.data?.url);
  //       return;
  //     }
  //     if (info.file.status === 'error') {
  //       setLoading(false);
  //       message.error('上传失败')
  //     }
  //   }
  // }

  return (
    <Modal
      open={visible}
      onCancel={() => close()}
      onOk={handleOk}
      title={data ? '编辑版本' : '新增版本'}
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
          label="版本类型"
          name="type"
          rules={[{ required: true, message: '请选择版本类型' }]}
        >
          <Select placeholder="请选择版本类型" options={VERSION_TYPE.options()} />
        </Form.Item>
        <Form.Item
          label="项目压缩包"
          name="zipPath"
          rules={[{ required: true, message: '请选择项目压缩包' }]}
        >
          <CUpload
            accept="application/zip"
            name="zip"
          >
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </CUpload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

UpdateVersionModal.displayName = 'UpdateVersionModal';

export default UpdateVersionModal;
