import { createSlice, current } from '@reduxjs/toolkit';

const channelsReducer = createSlice({
  name: 'channels',
  initialState: { channels: [], currentChannelId: null },
  reducers: {
    setInitialState(state, { payload }) {
      console.log(payload, current(state));
      const { channels, currentChannelId } = payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
  },
});

export const { setInitialState } = channelsReducer.actions;

export default channelsReducer.reducer;
