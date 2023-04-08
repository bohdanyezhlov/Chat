import { createSlice } from '@reduxjs/toolkit';

const defaultCurrentChannelId = 1;

const channelsReducer = createSlice({
  name: 'channels',
  initialState: { channels: [], currentChannelId: defaultCurrentChannelId },
  reducers: {
    setInitialState(state, { payload }) {
      const { channels, currentChannelId } = payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel(state, { payload }) {
      const { currentChannelId } = payload;
      state.currentChannelId = currentChannelId;
    },
  },
});

export const { setInitialState, setCurrentChannel } = channelsReducer.actions;

export default channelsReducer.reducer;
