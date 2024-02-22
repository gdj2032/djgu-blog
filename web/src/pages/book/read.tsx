/**
 * 阅读
 */
import { useAppSelector, bookAction } from '@/stores';
import React from 'react';
import './index.scss';

function BookRead() {
  const { currentBook } = useAppSelector(bookAction.bookInfo)
  return (
    <div className='g-book-read'>
      <div className='m-title'>{currentBook?.name}</div>
    </div>
  )
}

BookRead.displayName = 'BookRead';

export default BookRead;
