import { combineReducers } from '@reduxjs/toolkit';

import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';

const store = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
});

export default store;
