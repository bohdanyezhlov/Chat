import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import EnterNewMessage from './EnterNewMessage';

const Messages = () => {
  const { messages } = useSelector((state) => state.messages);
  const { currentChannelId } = useSelector((state) => state.channels);
  const bottomMessageRef = useRef();

  useEffect(() => {
    bottomMessageRef.current.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <>
      <div className="chat-messages overflow-auto px-5">
        {messages.map(({ username, body, id }) => (
          <div className="text-break mb-2" key={id}>
            <strong>{username}</strong>: {body}
          </div>
        ))}
        <div ref={bottomMessageRef} />
      </div>
      <div className="mt-auto px-5 py-3">
        <EnterNewMessage channelId={currentChannelId} />
      </div>
    </>
  );
};

export default Messages;
