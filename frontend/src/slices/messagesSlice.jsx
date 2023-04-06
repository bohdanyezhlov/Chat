import { createSlice } from '@reduxjs/toolkit';

const messagesReducer = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    setInitialState(state, { payload }) {
      const { messages } = payload;
      state.messages = messages;
    },
    addMessage(state, { payload }) {
      const { message } = payload;
      state.messages.push(message);
    },
  },
});

export const { setInitialState, addMessage } = messagesReducer.actions;

export default messagesReducer.reducer;
