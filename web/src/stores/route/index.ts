import { RouteService } from '@/typings/route';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface IRouteState {
  routes: RouteService.IListData[],
  currentRoute: RouteService.IListData,
  currentSelectKeys: string[];
}

const initialState: IRouteState = {
  routes: [],
  currentRoute: undefined,
  currentSelectKeys: [],
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRouteInfo: (state, action: PayloadAction<IRouteState>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setCurrentRoute: (state, action: PayloadAction<IRouteState['currentRoute']>) => {
      return {
        ...state,
        currentRoute: action.payload
      };
    },
    setCurrentSelectKeys: (state, action: PayloadAction<IRouteState['currentSelectKeys']>) => {
      return {
        ...state,
        currentSelectKeys: action.payload
      };
    },
  }
});

const routeInfo = (state: RootState) => state.route;

const { setRouteInfo, setCurrentRoute, setCurrentSelectKeys } = routeSlice.actions;

const routeReducer = routeSlice.reducer;

export {
  routeReducer,
  routeInfo,
  setRouteInfo,
  setCurrentRoute,
  setCurrentSelectKeys,
};
