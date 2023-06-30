import { combineReducers, configureStore } from '@reduxjs/toolkit';

import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';
import themeReducer from './themeSlice';

const reducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
  theme: themeReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
