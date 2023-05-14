import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  getCurrentChannel,
  getCurrentChannelName,
  getMessagesForCurrentChannel,
} from '../../selectors';
import { MessageProps, Message as MessageType } from '../../types';
import EnterNewMessage from './EnterNewMessage';

const Message = ({ message }: MessageProps) => {
  return (
    <div className="text-break mb-2">
      <strong>{message.username}</strong>: {message.body}
    </div>
  );
};

const Messages = () => {
  const { t } = useTranslation();
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const channel = useSelector(getCurrentChannel);
  const messages = useSelector(getMessagesForCurrentChannel);
  const channelName = useSelector(getCurrentChannelName(channel?.id));

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]);

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <strong># {channelName}</strong>
        </p>
        <span className="text-muted">
          {`${messages.length} ${t('chat.messageCount', {
            count: messages.length,
          })}`}
        </span>
      </div>
      <div className="chat-messages overflow-auto px-5">
        {messages.map((message: MessageType) => {
          return <Message key={message.id} message={message} />;
        })}
        <div ref={latestMessageRef} />
      </div>
      <div className="mt-auto px-5 py-3">
        <EnterNewMessage channelId={channel?.id} />
      </div>
    </>
  );
};

export default Messages;
