import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  getCurrentChannel,
  getCurrentChannelName,
  getMessagesForCurrentChannel,
} from '../../selectors';
import { MessageProps, Message as MessageType, RootState } from '../../types';
import EnterNewMessage from './EnterNewMessage';

const Message = ({ message }: MessageProps) => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const formatMessageTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    const date = new Date(timeString);
    return date.toLocaleString(undefined, options);
  };

  const messageClass = cn('text-break', 'mb-2', 'p-1', 'border', 'shadow', {
    'border-white': currentTheme === 'light',
    'border-dark': currentTheme === 'dark',
  });

  return (
    <div className={messageClass}>
      <strong>{message.username}</strong>
      <span className="text-muted ms-2 small">
        {formatMessageTime(message.createdAt)}
      </span>
      <p className="m-0">{message.body}</p>
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
      <div className="mb-4 p-3 shadow-sm small">
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
