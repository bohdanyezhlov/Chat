/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';

import {
  Message,
  MessagesState,
  RemoveChannel,
  SetInitialState,
} from '../types';
import { removeChannel, setInitialState } from './channelsSlice';

interface AddMessage {
  message: Message;
}

const initialState: MessagesState = {
  messages: [],
};

const messagesReducer = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<AddMessage>) {
      const { message } = action.payload;
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action: PayloadAction<RemoveChannel>) => {
        const { currentChannelId } = action.payload;
        remove(state.messages, (m) => m.channelId === currentChannelId.id);
      })
      .addCase(
        setInitialState,
        (state, action: PayloadAction<SetInitialState>) => {
          const { messages } = action.payload;
          state.messages = messages;
        }
      );
  },
});

export const { addMessage } = messagesReducer.actions;

export default messagesReducer.reducer;
