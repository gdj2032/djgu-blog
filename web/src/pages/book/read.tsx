/**
 * 阅读
 */
import { PathConfig } from '@/framework/routes/routes';
import { useAppSelector, bookAction } from '@/stores';
import { BookOutlined, HomeOutlined, MenuOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import ReadBookUtil from './bookUtil';
import ChapterModal from './chapterModal';
import './index.scss';
import SetModal from './setModal';

const bookReadId = 'bookReadId';

function BookRead() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBook, chapters, chapter, setting, loading } = useAppSelector(bookAction.bookInfo);
  const [readBookUtil, setReadBookUtil] = useState<ReadBookUtil>();
  const [openSetModal, setOpenSetModal] = useState(false);
  const [openChapterModal, setOpenChapterModal] = useState(false);

  const config = useMemo(() => {
    const curChapter = chapters[currentBook?.id]?.find(e => e.id === chapter[currentBook?.id]?.chapterId);
    const pageId = chapter[currentBook?.id]?.pageId;
    const allPage = curChapter?.pages.length;
    const curPage = curChapter?.pages[pageId] || [];
    return { curChapter, curPage, pageId, allPage, chapterId: curChapter?.id };
  }, [currentBook, chapters, chapter]);

  useEffect(() => {
    init();
  }, [currentBook]);

  useEffect(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chapter]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      onNext();
    } else if (e.code === 'ArrowLeft') {
      onPrev();
    }
  };

  const init = () => {
    const curChapter = chapters[currentBook?.id];
    if (currentBook && !curChapter) {
      const rbu = new ReadBookUtil({ id: bookReadId, book: currentBook, isInit: true });
      setReadBookUtil(rbu);
    }
  };

  const onPrev = () => {
    let pageId = config.pageId - 1;
    let chapterId = config.chapterId;
    if (pageId < 0) {
      chapterId = config.chapterId - 1;
      const prevChapter = chapters[currentBook?.id]?.[chapterId];
      pageId = prevChapter?.pages.length - 1;
    }
    if (chapterId >= 0 && pageId >= 0) {
      dispatch(bookAction.setChapter({ id: currentBook.id, chapter: { chapterId, pageId } }));
    }
  };

  const onNext = () => {
    const curPageId = config.pageId;
    const allPage = config.allPage;
    let pageId = curPageId + 1;
    let chapterId = config.chapterId;
    if (pageId >= allPage) {
      chapterId = config.curChapter?.id + 1;
      pageId = 0;
    }
    if (chapterId < config.curChapter?.total && pageId < allPage) {
      dispatch(bookAction.setChapter({ id: currentBook.id, chapter: { chapterId, pageId } }));
    }
  };

  const handleReset = () => {
    if (readBookUtil) {
      readBookUtil.init();
    } else {
      const rbu = new ReadBookUtil({ id: bookReadId, book: currentBook, isInit: false });
      setReadBookUtil(rbu);
    }
  };

  const handleSet = () => {
    setOpenSetModal(true);
  };

  const handleChapter = () => {
    setOpenChapterModal(true);
  };

  return (
    <div className='g-book-read' style={{ background: setting.background, color: setting.color }}>
      <div className='m-book-title'>
        <HomeOutlined className='m-home' onClick={() => navigate(PathConfig.home)} />
        <BookOutlined className='m-home' onClick={() => navigate(PathConfig.book)} />
        <ReloadOutlined className='m-home' onClick={handleReset} />
        <SettingOutlined className='m-home' onClick={handleSet} />
        <MenuOutlined className='m-home' onClick={handleChapter} />
        {`${currentBook?.name} > `}
        {config?.curChapter?.title && `${config.curChapter?.title} (${config.pageId + 1}/${config.allPage})`}
      </div>
      <div className='m-chapter-page' id={bookReadId} style={{ ...setting, lineHeight: `${setting.lineHeight}px` }}>
        {config.curPage?.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>

      {loading && (
        <div className='m-book-loading'>
          <Spin spinning={loading}></Spin>
          <Button type='link' onClick={() => dispatch(bookAction.setLoading(false))}>
            取消
          </Button>
        </div>
      )}

      <SetModal
        open={openSetModal}
        close={() => {
          setOpenSetModal(false);
        }}
        onReset={handleReset}
      />

      <ChapterModal
        open={openChapterModal}
        close={() => {
          setOpenChapterModal(false);
        }}
        chapterId={config.chapterId}
      />
    </div>
  );
}

BookRead.displayName = 'BookRead';

export default BookRead;
