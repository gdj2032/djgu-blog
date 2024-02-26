/**
 * 小说
 */
import { bookAction } from '@/stores';
import { BookService } from '@/typings/book';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import BookList from './bookList';
import './index.scss';

function Book() {
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [selects, setSelects] = useState([])

  useEffect(() => {
    setSelects([])
  }, [isEdit])

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
          fullName: file.name,
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

  const handleEdit = () => {
    setIsEdit(!isEdit);
  }

  const handleDelete = () => {
    if (selects.length) {
      dispatch(bookAction.deleteBooks(selects))
      setIsEdit(false);
    }
  }

  return (
    <div className='g-book'>
      <div className='m-b-top'>
        <div className='p-bt-title'>书架</div>
        <div className='p-bt-upload'>
          {isEdit && <Button className='global-mgr-20' danger onClick={handleDelete} disabled={!!selects.length}>删除</Button>}
          <Button className='global-mgr-20' onClick={handleEdit}>{isEdit ? '取消' : '管理'}</Button>
          <Upload
            name='file'
            accept='text/plain'
            itemRender={() => <></>}
            customRequest={handleSelect}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>
        </div>
      </div>
      <BookList isEdit={isEdit} onChangeSelect={setSelects} selects={selects} />
    </div>
  )
}

Book.displayName = 'Book';

export default Book;
