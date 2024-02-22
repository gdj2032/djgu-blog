import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type T_THEME_MODE = 'dark' | 'light'

export interface ISysState {
  mode: T_THEME_MODE;
  snow: boolean;
}

const initialState: ISysState = {
  mode: 'light',
  snow: true,
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
    setSnow: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        snow: action.payload
      };
    },
    setSys: (state, action: PayloadAction<ISysState>) => {
      return {
        ...state,
        ...action.payload
      };
    },
  }
});

const sysInfo = (state: RootState) => state.sys;

const { setMode, setSnow, setSys } = sysSlice.actions;

const sysReducer = sysSlice.reducer;

export {
  sysReducer,
  sysInfo,
  setMode,
  setSnow,
  setSys,
};
