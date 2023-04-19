import leoProfanity from 'leo-profanity';

export const getCurrentChannel = (state) => {
  const { channels, currentChannelId } = state.channels;
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  return currentChannel;
};

export const getMessagesForCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  const { messages } = state.messages;
  const messagesForCurrentChannel = messages.filter((m) => m.channelId === currentChannelId);
  const filteredMessages = messagesForCurrentChannel.map((m) => ({
    ...m,
    body: leoProfanity.clean(m.body),
  }));

  return filteredMessages;
};

export const getChannelsNames = (state) => {
  const { channels } = state.channels;
  const channelsNames = channels.map((channel) => channel.name);

  return channelsNames;
};

export const getCurrentChannelName = (currentId) => (state) => {
  const { channels } = state.channels;
  const [currentChannel] = channels.filter((c) => c.id === currentId);
  const filteredChannelName = leoProfanity.clean(currentChannel?.name);

  return filteredChannelName;
};

export const getLastChannelId = (state) => {
  const { channels } = state.channels;
  const lastChannel = channels[channels.length - 1];

  return lastChannel.id;
};
