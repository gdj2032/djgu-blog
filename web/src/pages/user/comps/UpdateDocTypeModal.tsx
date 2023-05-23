/**
 * 新增编辑文档类型
 */
import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { IModalProps } from '@djgu/react-comps/dist/utils/openModal'
import { documentTypeService } from '@/services';

interface IProps extends IModalProps {
  data?: any;
}

function UpdateDocTypeModal(props: IProps) {
  const { visible, close, data, ...arg } = props;
  const [loading, setLoading] = useState(false)

  let formRef;

  const handleOk = async () => {
    const params = await formRef?.validateFields();
    setLoading(true)
    if (data) {
      // const res = await documentTypeService.editDocumentType(data.id, params.name);
      // if (res?.code === 200) {
      //   message.success('编辑文档类型成功')
      //   close?.(true)
      // }
    } else {
      // const res = await documentTypeService.addDocumentType(params.name);
      // console.log("🚀 ~ file: UpdateDocTypeModal.tsx:30 ~ handleOk ~ res", res)
      // if (res?.code === 200) {
      //   message.success('新增文档类型成功')
      //   close?.(true)
      // }
    }
    setLoading(false)
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
          label="文档类型名称"
          name="name"
          rules={[{ required: true, message: '请输入文档类型名称' }, { max: 20, message: '文档类型名称长度不能超过20字' }]}
        >
          <Input placeholder="请输入文档类型名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

UpdateDocTypeModal.displayName = 'UpdateDocTypeModal';

export default UpdateDocTypeModal;
