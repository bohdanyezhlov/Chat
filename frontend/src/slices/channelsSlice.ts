/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';

import { ChannelsState, RemoveChannel, SetInitialState } from '../types';

interface SetCurrentChannel {
  currentChannelId: number;
}

interface AddChannel {
  channel: {
    id: number;
    name: string;
    removable: boolean;
  };
}

interface RenameChannel {
  updatedChannel: {
    id: number;
    name: string;
    removable: boolean;
  };
}

export const defaultCurrentChannelId = 1;

const initialState: ChannelsState = {
  channels: [],
  currentChannelId: defaultCurrentChannelId,
};

const channelsReducer = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState(state, action: PayloadAction<SetInitialState>) {
      const { channels, currentChannelId } = action.payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel(state, action: PayloadAction<SetCurrentChannel>) {
      const { currentChannelId } = action.payload;
      state.currentChannelId = currentChannelId;
    },
    addChannel(state, action: PayloadAction<AddChannel>) {
      const { channel } = action.payload;
      state.channels.push(channel);
    },
    removeChannel(state, action: PayloadAction<RemoveChannel>) {
      const { currentChannelId } = action.payload;
      remove(state.channels, (c) => c.id === currentChannelId.id);

      if (state.currentChannelId === currentChannelId.id) {
        state.currentChannelId = defaultCurrentChannelId;
      }
    },
    renameChannel(state, action: PayloadAction<RenameChannel>) {
      const { id, name } = action.payload.updatedChannel;
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
