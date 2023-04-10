// eslint-disable-next-line no-unused-vars
import { createSlice, current } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import { removeChannel } from './channelsSlice';

const messagesReducer = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    setInitialState(state, { payload }) {
      const { messages } = payload;
      state.messages = messages;
    },
    addMessage(state, { payload }) {
      console.log('addMessage', current(state), payload);
      const { message } = payload;
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload }) => {
      const { currentChannelId } = payload;
      console.log('extra removeChannel', current(state), payload);
      remove(state.messages, (m) => m.channelId === currentChannelId.id);
    });
  },
});

export const { setInitialState, addMessage } = messagesReducer.actions;

export default messagesReducer.reducer;
