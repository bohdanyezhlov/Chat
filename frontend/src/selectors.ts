import { RootState } from './types';

export const getCurrentChannel = (state: RootState) => {
  const { channels, currentChannelId } = state.channels;
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  return currentChannel!; // FIXME: remove !
};

export const getMessagesForCurrentChannel = (state: RootState) => {
  const { currentChannelId } = state.channels;
  const { messages } = state.messages;
  const messagesForCurrentChannel = messages.filter(
    (m) => m.channelId === currentChannelId
  );

  return messagesForCurrentChannel;
};

export const getChannelsNames = (state: RootState) => {
  const { channels } = state.channels;
  const channelsNames = channels.map((channel) => channel.name);

  return channelsNames;
};

export const getCurrentChannelName =
  (currentId: number | null) => (state: RootState) => {
    if (!currentId) return ''; // FIXME: ?

    const { channels } = state.channels;
    const [currentChannel] = channels.filter((c) => c.id === currentId);

    return currentChannel.name;
  };

export const getLastChannelId = (state: RootState) => {
  const { channels } = state.channels;
  const lastChannel = channels[channels.length - 1];

  return lastChannel.id;
};
