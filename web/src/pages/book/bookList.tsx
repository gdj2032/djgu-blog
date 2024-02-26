/**
 * 书架
 */
import { BOOK_BG_COLOR } from '@/constants';
import { PathConfig } from '@/framework/routes/routes';
import { bookAction, useAppSelector } from '@/stores';
import { BookService } from '@/typings/book';
import { CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import './index.scss';

interface IProps {
  isEdit: boolean;
  selects: string[]
  onChangeSelect?: (ids: string[]) => void;
}

function BookList(props: IProps) {
  const { isEdit, onChangeSelect, selects } = props;
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { books } = useAppSelector(bookAction.bookInfo)

  const handleBook = (e: BookService.IBookItem) => {
    dispatch(bookAction.setCurrentBook(e))
    navigate(`${PathConfig.bookRead}?id=${e.id}`)
  }

  const renderBookItem = (e: BookService.IBookItem) => {
    const isSel = selects.includes(e.id)
    return (
      <div key={e.id} className="p-book-item" style={{ background: BOOK_BG_COLOR.getBg(e.id) }} onClick={() => handleBook(e)}>
        <div className="i-name">{e.name}</div>
        <div className="i-author">{e.author}</div>

        {isEdit && (
          <div
            className="i-edit"
            onClick={evt => {
              evt.stopPropagation();
              if (isSel) {
                onChangeSelect?.(selects.filter(v => v !== e.id))
              } else {
                const sels = [...selects, e.id]
                onChangeSelect?.(sels)
              }
            }}
          >
            <CheckCircleOutlined style={{ color: isSel ? 'rgb(47, 255, 88)' : '#fff', fontSize: 24 }} />
          </div>
        )}
      </div>
    )
  }
  return (
    <div className='m-book-list'>
      {books.map(e => renderBookItem(e))}
    </div>
  )
}

BookList.displayName = 'BookList';

export default BookList;
