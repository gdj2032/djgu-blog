/**
 * 小说
 */
import { bookAction } from '@/stores';
import { BookService } from '@/typings/book';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useDispatch } from 'react-redux';
import BookList from './bookList';
import './index.scss';

function Book() {
  const dispatch = useDispatch()

  const handleSelect = (opt) => {
    const { file } = opt
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = () => {
      const content = reader.result as string;
      const reg = /作者：(\S*)/
      const author = content.match(reg)?.[1]
      const filename = file.name.replace('.txt', '')
      const fileData = window.app.setBook({ filename: file.name, filepath: file.path, content })
      if (fileData?.filepath) {
        const id = dayjs().valueOf().toString();
        const fileItem: BookService.IBookItem = {
          id,
          name: filename,
          type: 'txt',
          author,
          createTime: +id,
          size: file.size,
          oldPath: file.path,
          newPath: fileData.filepath,
        };
        dispatch(bookAction.addBook(fileItem));
      }
    };
    reader.onerror = function () {
      console.log('读取失败');
      console.log(reader.error);
    };
  }

  return (
    <div className='g-book'>
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
      <BookList />
    </div>
  )
}

Book.displayName = 'Book';

export default Book;
