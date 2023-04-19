export const getCurrentChannel = (state) => {
  const { channels, currentChannelId } = state.channels;
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  return currentChannel;
};

export const getMessagesForCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  const { messages } = state.messages;
  const messagesForCurrentChannel = messages.filter((m) => m.channelId === currentChannelId);

  return messagesForCurrentChannel;
};

export const getChannelsNames = (state) => {
  const { channels } = state.channels;
  const channelsNames = channels.map((channel) => channel.name);

  return channelsNames;
};

export const getCurrentChannelName = (currentId) => (state) => {
  const { channels } = state.channels;
  const [currentChannel] = channels.filter((c) => c.id === currentId);

  return currentChannel?.name;
};

export const getLastChannelId = (state) => {
  const { channels } = state.channels;
  const lastChannel = channels[channels.length - 1];

  return lastChannel.id;
};
