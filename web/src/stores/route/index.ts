import { RouteService } from '@/typings/route';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export interface IrouteState {
  routes: RouteService.IListData[],
  currentRoute: RouteService.IListData,
}

const initialState: IrouteState = {
  routes: [],
  currentRoute: undefined,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRouteInfo: (state, action: PayloadAction<IrouteState>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setCurrentRoute: (state, action: PayloadAction<IrouteState['currentRoute']>) => {
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
