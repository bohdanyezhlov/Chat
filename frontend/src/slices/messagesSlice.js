/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
import { removeChannel, setInitialState } from './channelsSlice';

const messagesReducer = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    addMessage(state, { payload }) {
      const { message } = payload;
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, { payload }) => {
        const { currentChannelId } = payload;
        remove(state.messages, (m) => m.channelId === currentChannelId.id);
      })
      .addCase(setInitialState, (state, { payload }) => {
        const { messages } = payload;
        state.messages = messages;
      });
  },
});

export const { addMessage } = messagesReducer.actions;

export default messagesReducer.reducer;
