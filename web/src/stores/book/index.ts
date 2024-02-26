import { BookService } from '@/typings/book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface IBookState {
  books: BookService.IBookItem[];
  currentBook: BookService.IBookItem;
  // 所有阅读中的小说章节 key为id
  chapters: { [key: string]: BookService.IChapter[] };
  // 所有小说当前阅读到的章节 key为id
  chapter: { [key: string]: BookService.IChapterPageId };
  setting: BookService.ISetting;
  loading: boolean;
}

const initialState: IBookState = {
  books: [],
  currentBook: undefined,
  chapters: {},
  chapter: {},
  setting: {
    fontSize: 14,
    background: '#fff',
    color: '#000',
    lineHeight: 24,
  },
  loading: false,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<BookService.IBookItem>) => {
      if (!action.payload) {
        return state;
      }
      let books = [...state.books];
      if (books.find(e => e.name === action.payload.name)) {
        books = books.map(e => {
          if (e.name === action.payload.name) {
            e = { ...action.payload, id: e.id };
          }
          return e;
        })
      } else {
        books.push(action.payload)
      }
      return {
        ...state,
        books,
      };
    },
    setCurrentBook: (state, action: PayloadAction<BookService.IBookItem>) => {
      return {
        ...state,
        currentBook: action.payload
      }
    },
    setChapters: (state, action: PayloadAction<{ id: string, chapters: BookService.IChapter[] }>) => {
      return {
        ...state,
        chapters: { ...state.chapters, [action.payload.id]: action.payload.chapters }
      }
    },
    setChapter: (state, action: PayloadAction<{ id: string, chapter: BookService.IChapterPageId }>) => {
      return {
        ...state,
        chapter: { ...state.chapter, [action.payload.id]: action.payload.chapter }
      }
    },
    setSetting: (state, action: PayloadAction<BookService.ISetting2>) => {
      return {
        ...state,
        setting: { ...state.setting, ...action.payload },
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload
      }
    },
    deleteBooks: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload
      const newBooks = [...state.books].filter(e => !ids.includes(e.id))
      const chapters = { ...state.chapters };
      const chapter = { ...state.chapter };
      if (ids?.length) {
        for (const id of ids) {
          chapters[id] = undefined
          chapter[id] = undefined;
          const bookItem = state.books.find(e => e.id === id);
          window.app?.deleteBook?.({ filename: bookItem.fullName })
        }
      }
      return {
        ...state,
        books: newBooks,
        chapters,
        chapter,
      }
    }
  }
});

const bookInfo = (state: RootState) => state.book;

const { addBook, setCurrentBook, setChapters, setChapter, setSetting, setLoading, deleteBooks } = bookSlice.actions;

const bookReducer = bookSlice.reducer;

export {
  bookReducer,
  bookInfo,
  addBook,
  setCurrentBook,
  setChapters,
  setChapter,
  setSetting,
  setLoading,
  deleteBooks,
};
