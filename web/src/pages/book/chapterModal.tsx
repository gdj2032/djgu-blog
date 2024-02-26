/**
 * 目录
 */
import { useAppSelector, bookAction } from '@/stores';
import { BookService } from '@/typings/book';
import { Drawer } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import './index.scss';

interface IProps {
  open: boolean;
  chapterId: number;
  close?: () => void;
}

const ChapterModalMenuId = 'ChapterModalMenuId'

function ChapterModal(props: IProps) {
  const { open, close, chapterId } = props;
  const dispatch = useDispatch()
  const { currentBook, chapters } = useAppSelector(bookAction.bookInfo)

  const menus = useMemo(() => chapters[currentBook?.id], [currentBook, chapters])

  useEffect(() => {
    if (chapters && currentBook) {
      handleScroll()
    }
  }, [open, chapters, currentBook])

  const handleScroll = () => {
    if (open) {
      const dom = document.getElementById(ChapterModalMenuId);
      dom?.scroll({ top: 33 * chapterId })
    }
  }

  const handleSetChapter = (e: BookService.IChapter) => {
    dispatch(bookAction.setChapter({ id: currentBook.id, chapter: { chapterId: e.id, pageId: 0 } }))
    close?.()
  }
  return (
    <Drawer
      open={open}
      placement='right'
      title='目录'
      onClose={close}
      getContainer={false}
      destroyOnClose
      className='m-set-modal'
    >
      <div className='p-menus' id={ChapterModalMenuId}>
        {
          menus?.map(e => (
            <div key={e.id} className={`p-menu-item ${chapterId === e.id && 'p-menu-item-active'}`} onClick={() => handleSetChapter(e)}>{e.title}</div>
          ))
        }
      </div>
    </Drawer>
  )
}

ChapterModal.displayName = 'ChapterModal';

export default ChapterModal;
