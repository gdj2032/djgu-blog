/**
 * 文件上传组件
 */
import React, { ReactNode } from 'react';
import { Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { store } from '@/stores';
import { API_HOST } from '@/constants';

interface IProps extends UploadProps {
  [x: string]: any;
  children?: ReactNode;
}

function CUpload(props: IProps) {
  const curProps = {
    name: 'file',
    action: `${API_HOST}/file/upload`,
    capture: '',
    withCredentials: true,
    multiple: false,
    maxCount: 1,
    headers: {
      SESSION: store.getState().user.session,
    },
    onChange: props.onChange,
    ...props,
  }
  return (
    <Upload {...curProps}>
      {curProps.children}
    </Upload>
  )
}

CUpload.displayName = 'CUpload';

export default CUpload;
