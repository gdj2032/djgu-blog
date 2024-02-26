/**
 * 阅读
 */
import { PathConfig } from '@/framework/routes/routes';
import { useAppSelector, bookAction } from '@/stores';
import { BookOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import ReadBookUtil from './bookUtil';
import './index.scss';

const bookReadId = 'bookReadId'

function BookRead() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentBook, chapters, chapter, setting, loading } = useAppSelector(bookAction.bookInfo)
  const [readBookUtil, setReadBookUtil] = useState<ReadBookUtil>()

  const config = useMemo(() => {
    const curChapter = chapters[currentBook?.id]?.find(e => e.id === chapter[currentBook?.id]?.chapterId)
    const pageId = chapter[currentBook?.id]?.pageId
    const allPage = curChapter?.pages.length;
    const curPage = curChapter?.pages[pageId] || []
    return { curChapter, curPage, pageId, allPage, chapterId: curChapter?.id }
  }, [currentBook, chapters, chapter])

  useEffect(() => {
    init()
  }, [currentBook])

  useEffect(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [chapter])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      onNext()
    } else if (e.code === 'ArrowLeft') {
      onPrev()
    }
  }

  const init = () => {
    const curChapter = chapters[currentBook?.id]
    if (currentBook && !curChapter) {
      const rbu = new ReadBookUtil({ id: bookReadId, book: currentBook, setting, isInit: true })
      setReadBookUtil(rbu)
    }
  }

  const onPrev = () => {
    let pageId = config.pageId - 1
    let chapterId = config.chapterId;
    if (pageId < 0) {
      chapterId = config.chapterId - 1
      const prevChapter = chapters[currentBook?.id]?.[chapterId]
      pageId = prevChapter?.pages.length - 1
    }
    if (config.chapterId > 0) {
      dispatch(bookAction.setChapter({ id: currentBook.id, chapter: { chapterId, pageId } }))
    }
  }

  const onNext = () => {
    const curPageId = config.pageId
    const allPage = config.allPage;
    let pageId = curPageId + 1
    let chapterId = config.curChapter?.id;
    if (pageId >= allPage) {
      chapterId = config.curChapter?.id + 1
      pageId = 0
    }
    if (config.chapterId < config.curChapter?.total) {
      dispatch(bookAction.setChapter({ id: currentBook.id, chapter: { chapterId, pageId } }))
    }
  }

  const handleReset = () => {
    if (readBookUtil) {
      readBookUtil.init()
    } else {
      const rbu = new ReadBookUtil({ id: bookReadId, book: currentBook, setting, isInit: false })
      setReadBookUtil(rbu)
    }
  }

  return (
    <div className='g-book-read'    >
      <div className='m-book-title'>
        <HomeOutlined className='m-home' onClick={() => navigate(PathConfig.home)} />
        <BookOutlined className="m-home" onClick={() => navigate(PathConfig.book)} />
        <ReloadOutlined className="m-home" onClick={handleReset} />
        {`${currentBook?.name} > ${config.curChapter?.title} (${config.pageId + 1}/${config.allPage})`}
      </div>
      <div className='m-chapter-page' id={bookReadId} style={{ ...setting }}>{config.curPage?.map((e, i) => <p key={i}>{e}</p>)}</div>

      {
        loading &&
        <div className='m-book-loading'>
          <Spin spinning={loading} />
        </div>
      }
    </div>
  )
}

BookRead.displayName = 'BookRead';

export default BookRead;
