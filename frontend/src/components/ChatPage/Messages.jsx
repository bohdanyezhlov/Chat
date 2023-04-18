import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';

import EnterNewMessage from './EnterNewMessage';

const Message = ({
  index, body, username, latestMessageRef, messagesForCurrentChannel,
}) => (
  <div className="text-break mb-2" ref={messagesForCurrentChannel.length - 1 === index ? latestMessageRef : null}>
    <strong>{username}</strong>
    :
    {' '}
    {body}
  </div>
);

const getCurrentChannel = (state) => {
  const { channels, currentChannelId } = state.channels;
  const currentChannel = channels.find((c) => c.id === currentChannelId);
  return currentChannel;
};

const getMessagesForCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  const { messages } = state.messages;
  const messagesForCurrentChannel = messages.filter((m) => m.channelId === currentChannelId);
  return messagesForCurrentChannel;
};

const Messages = () => {
  const { t } = useTranslation();
  const latestMessageRef = useRef();
  const channel = useSelector(getCurrentChannel);
  const messages = useSelector(getMessagesForCurrentChannel);
  const filteredMessages = messages.map((m) => ({
    ...m,
    body: leoProfanity.clean(m.body),
  }));

  useEffect(() => {
    if (latestMessageRef.current) { // messages can be empty array
      latestMessageRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.length]);

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <strong>
            #
            {' '}
            {leoProfanity.clean(channel.name)}
          </strong>
        </p>
        <span className="text-muted">
          {`${filteredMessages.length} ${t('chat.messageCount', {
            count: filteredMessages.length,
          })}`}
        </span>
      </div>
      <div className="chat-messages overflow-auto px-5">
        {filteredMessages.map(({ username, body, id }, index) => (
          <Message
            username={username}
            body={body}
            key={id}
            index={index}
            latestMessageRef={latestMessageRef}
            messagesForCurrentChannel={filteredMessages}
          />
        ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <EnterNewMessage channelId={channel.id} />
      </div>
    </>
  );
};

export default Messages;
