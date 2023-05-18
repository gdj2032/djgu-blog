import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IUserState {
  id: string,
  isLogin?: boolean,
  first?: boolean,
  username: string;
}

const initialState: IUserState = {
  id: '',
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserState>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    clearUserInfo: (state) => {
      return {
        ...initialState
      }
    },
  }
});

const userInfo = (state: RootState) => state.user;

const { setUserInfo, clearUserInfo } = userSlice.actions;

const userReducer = userSlice.reducer;

export {
  userInfo,
  setUserInfo,
  clearUserInfo,
  userReducer,
};
