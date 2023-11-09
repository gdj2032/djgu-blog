import { RouteService } from '@/typings/route';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface ITabRouteState {
  routes: RouteService.IListData[],
  currentRoute: RouteService.IListData,
}

const initialState: ITabRouteState = {
  routes: [],
  currentRoute: undefined,
};

const tabRouteSlice = createSlice({
  name: 'tabRoute',
  initialState,
  reducers: {
    setTabRouteInfo: (state, action: PayloadAction<ITabRouteState>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setCurrentRoute: (state, action: PayloadAction<ITabRouteState['currentRoute']>) => {
      return {
        ...state,
        currentRoute: action.payload
      };
    },
  }
});

const tabRouteInfo = (state: RootState) => state.tabRoute;

const { setTabRouteInfo, setCurrentRoute } = tabRouteSlice.actions;

const tabRouteReducer = tabRouteSlice.reducer;

export {
  tabRouteReducer,
  tabRouteInfo,
  setTabRouteInfo,
  setCurrentRoute,
};
