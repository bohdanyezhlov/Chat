/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';

import { ChannelsState } from '../types';

export const defaultCurrentChannelId = 1;

const initialState: ChannelsState = {
  channels: [],
  currentChannelId: defaultCurrentChannelId,
};

const channelsReducer = createSlice({
  name: 'channels',
  initialState,
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
    addChannel(state, { payload }) {
      const { channel } = payload;
      state.channels.push(channel);
    },
    removeChannel(state, { payload }) {
      const { currentChannelId } = payload;
      remove(state.channels, (c) => c.id === currentChannelId.id);

      if (state.currentChannelId === currentChannelId.id) {
        state.currentChannelId = defaultCurrentChannelId;
      }
    },
    renameChannel(state, { payload }) {
      const { id, name } = payload.updatedChannel;
      const channel = state.channels.find((c) => c.id === id);

      if (channel) {
        channel.name = name;
      }
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
