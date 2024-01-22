import { RouteService } from '@/typings/route';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface IRouteState {
  routes: RouteService.IListData[],
  currentRoute: RouteService.IListData,
}

const initialState: IRouteState = {
  routes: [],
  currentRoute: undefined,
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
  }
});

const routeInfo = (state: RootState) => state.route;

const { setRouteInfo, setCurrentRoute } = routeSlice.actions;

const routeReducer = routeSlice.reducer;

export {
  routeReducer,
  routeInfo,
  setRouteInfo,
  setCurrentRoute,
};
