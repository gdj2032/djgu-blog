/**
 * 小说
 */
import { PathConfig } from '@/framework/routes/routes';
import { HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import './index.scss';

const fileInputId = 'file-input'

function Book() {
  const navigate = useNavigate()

  const handleSelect = (opt) => {
    console.info('--- info --->', opt);
    const { file } = opt
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = function () {
      console.info('--- reader.result --->', reader.result);
    };
    reader.onerror = function () {
      console.log('读取失败');
      console.log(reader.error);
    };
  }

  return (
    <div className='g-book'>
      <HomeOutlined className='m-home' onClick={() => navigate(PathConfig.home)} />

      <div className='m-b-top'>
        <div className='p-bt-title'>书架</div>
        <div className='p-bt-upload'>
          <Upload
            name='file'
            accept='text/plain'
            itemRender={() => <></>}
            customRequest={handleSelect}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </div>
      </div>
    </div>
  )
}

Book.displayName = 'Book';

export default Book;
