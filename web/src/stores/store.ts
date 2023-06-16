import { __DEV__ } from '@/constants';
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counter';
import { userReducer } from './user';
import logger from 'redux-logger';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { sysReducer } from './sys';

const persistConfig = {
  key: 'root',
  storage: storage, //指定存储位置，一定要写
  whitelist: ['user', 'sys']
}

const allReducers = combineReducers({
  counter: counterReducer,
  user: userReducer,
  sys: sysReducer,
})

const persistedReducer = persistReducer(persistConfig, allReducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: __DEV__,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(logger)
});

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
