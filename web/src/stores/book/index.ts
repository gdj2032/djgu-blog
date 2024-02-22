import { BookService } from '@/typings/book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface IBookState {
  books: BookService.IBookItem[];
  currentBook: BookService.IBookItem;
}

const initialState: IBookState = {
  books: [],
  currentBook: undefined,
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
            e = action.payload;
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
  }
});

const bookInfo = (state: RootState) => state.book;

const { addBook, setCurrentBook } = bookSlice.actions;

const bookReducer = bookSlice.reducer;

export {
  bookReducer,
  bookInfo,
  addBook,
  setCurrentBook,
};
