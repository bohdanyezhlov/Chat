import { combineReducers } from '@reduxjs/toolkit';

import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';

export default combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
});
