import { combineReducers } from '@reduxjs/toolkit';

import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';
import themeReducer from './themeSlice';

const store = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
  theme: themeReducer,
});

export default store;
