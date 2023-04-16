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

const Messages = () => {
  const { t } = useTranslation();
  const latestMessageRef = useRef();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const messagesForCurrentChannel = useSelector((state) => state.messages
    .messages.filter((m) => m.channelId === currentChannelId)); // FIXME: ?
  const [{ name: channelName }] = channels.filter(
    (c) => c.id === currentChannelId,
  );
  const filteredMessages = messagesForCurrentChannel.map((m) => ({
    ...m,
    body: leoProfanity.clean(m.body),
  }));

  useEffect(() => {
    if (latestMessageRef.current) { // messages can be empty array
      latestMessageRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messagesForCurrentChannel.length]);

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <strong>
            #
            {' '}
            {leoProfanity.clean(channelName)}
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
        <EnterNewMessage channelId={currentChannelId} />
      </div>
    </>
  );
};

export default Messages;
