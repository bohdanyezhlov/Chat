/* eslint-disable no-param-reassign */
import { createSlice, current } from '@reduxjs/toolkit';
import { remove } from 'lodash';

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
      console.log('setCurrentChannel', 'from', current(state), 'to', payload);
      const { currentChannelId } = payload;
      state.currentChannelId = currentChannelId;
    },
    addChannel(state, { payload }) {
      console.log('addChannel', 'from', current(state), 'to', payload);
      const { name } = payload;
      state.channels.push(name);
    },
    removeChannel(state, { payload }) {
      console.log('removeChannel', current(state.channels), payload);
      const { currentChannelId } = payload;
      remove(state.channels, (c) => c.id === currentChannelId.id);
      if (state.currentChannelId === currentChannelId.id) {
        state.currentChannelId = defaultCurrentChannelId;
      }
    },
    renameChannel(state, { payload }) {
      console.log('renameChannel', current(state.channels), payload);
      const { id, name } = payload;
      const channel = state.channels.find((c) => c.id === id);
      channel.name = name;
    },
  },
});

export const {
  setInitialState,
  setCurrentChannel,
  addChannel,
  removeChannel,
  renameChannel,
} = channelsReducer.actions;

export default channelsReducer.reducer;
