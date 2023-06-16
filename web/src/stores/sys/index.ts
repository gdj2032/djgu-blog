import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type T_THEME_MODE = 'dark' | 'light'

export interface ISysState {
  mode: T_THEME_MODE,
}

const initialState: ISysState = {
  mode: 'light',
};

const sysSlice = createSlice({
  name: 'sys',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<T_THEME_MODE>) => {
      return {
        ...state,
        mode: action.payload
      };
    },
  }
});

const sysInfo = (state: RootState) => state.sys;

const { setMode } = sysSlice.actions;

const sysReducer = sysSlice.reducer;

export {
  sysReducer,
  sysInfo,
  setMode,
};
