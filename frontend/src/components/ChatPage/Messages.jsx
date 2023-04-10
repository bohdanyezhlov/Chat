import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import EnterNewMessage from './EnterNewMessage';

const Messages = () => {
  const { t } = useTranslation();
  const latestMessageRef = useRef();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const messagesForCurrentChannel = messages.filter(
    (m) => m.channelId === currentChannelId,
  );

  const [{ name: channelName }] = channels.filter(
    (c) => c.id === currentChannelId,
  );

  useEffect(() => {
    if (latestMessageRef.current) { // messages can be empty array
      latestMessageRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messagesForCurrentChannel]);

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
          {`${messagesForCurrentChannel.length} ${t('chat.messageCount', {
            count: messagesForCurrentChannel.length,
          })}`}
        </span>
      </div>
      <div className="chat-messages overflow-auto px-5">
        {messagesForCurrentChannel.map(({ username, body, id }, index) => (
          <div className="text-break mb-2" key={id} ref={messagesForCurrentChannel.length - 1 === index ? latestMessageRef : null}>
            <strong>{username}</strong>
            :
            {' '}
            {leoProfanity.clean(body)}
          </div>
        ))}
        {/* <div ref={bottomMessageRef} /> */}
      </div>
      <div className="mt-auto px-5 py-3">
        <EnterNewMessage channelId={currentChannelId} />
      </div>
    </>
  );
};

export default Messages;
