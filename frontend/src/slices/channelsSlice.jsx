import { createSlice, current } from '@reduxjs/toolkit';
// import { remove } from 'lodash';

const defaultCurrentChannelId = 1;

const channelsReducer = createSlice({
  name: 'channels',
  initialState: { channels: [], currentChannelId: defaultCurrentChannelId },
  reducers: {
    setInitialState(state, { payload }) {
      const { channels, currentChannelId } = payload;
      return {
        ...state,
        channels,
        currentChannelId,
      };
    },
    setCurrentChannel(state, { payload }) {
      console.log('setCurrentChannel', 'from', current(state), 'to', payload);
      const newState = { ...state };
      const { currentChannelId } = payload;
      newState.currentChannelId = currentChannelId;
    },
    addChannel(state, { payload }) {
      console.log('addChannel', 'from', current(state), 'to', payload);
      const { name } = payload;
      state.channels.push(name);
    },
    removeChannel(state, { payload }) {
      console.log('removeChannel', current(state.channels), payload);
      const { currentChannelId: channelIdToRemove } = payload;
      const channels = state.channels.filter((c) => c.id !== channelIdToRemove.id);
      const currentChannelId = state.currentChannelId === channelIdToRemove.id
        ? defaultCurrentChannelId
        : state.currentChannelId;
      return { ...state, channels, currentChannelId };
    },
    renameChannel(state, { payload }) {
      console.log('renameChannel', current(state.channels), payload);
      const { id, name } = payload.updatedChannel;
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
