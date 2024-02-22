/**
 * 书架
 */
import { BOOK_BG_COLOR } from '@/constants';
import { PathConfig } from '@/framework/routes/routes';
import { bookAction, useAppSelector } from '@/stores';
import { BookService } from '@/typings/book';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import './index.scss';

interface IProps {
}

function BookList(props: IProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { books } = useAppSelector(bookAction.bookInfo)

  const handleBook = (e: BookService.IBookItem) => {
    dispatch(bookAction.setCurrentBook(e))
    navigate(`${PathConfig.bookRead}?id=${e.id}`)
  }

  const renderBookItem = (e: BookService.IBookItem) => {
    return (
      <div key={e.id} className="p-book-item" style={{ background: BOOK_BG_COLOR.getBg(e.id) }} onClick={() => handleBook(e)}>
        <div className="i-name">{e.name}</div>
        <div className="i-author">{e.author}</div>
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
