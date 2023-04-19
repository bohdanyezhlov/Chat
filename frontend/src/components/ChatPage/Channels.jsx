import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import leoProfanity from 'leo-profanity';

import { getLastChannelId } from '../../selectors';
import { setCurrentChannel, defaultCurrentChannelId } from '../../slices/channelsSlice';
import { openModal } from '../../slices/modalSlice';

const Channel = (props) => {
  const {
    channel,
    isActive,
    handleSetCurrentChannel,
    handleRemoveChannel,
    handleRenameChannel,
  } = props;
  const { t } = useTranslation();
  const variant = isActive ? 'secondary' : '';

  return (
    <li className="nav-item w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            onClick={handleSetCurrentChannel(channel.id)}
            type="button"
            variant={variant}
            className="w-100 rounded-0 text-start text-truncate"
          >
            <span className="me-1">#</span>
            {leoProfanity.clean(channel.name)}
          </Button>
          <Dropdown.Toggle
            split
            className="flex-grow-0"
            variant={variant}
          >
            <span className="visually-hidden">
              {t('channels.menu')}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleRemoveChannel(channel.id)}>
              {t('channels.remove')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRenameChannel(channel.id)}>
              {t('channels.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          onClick={handleSetCurrentChannel(channel.id)}
          type="button"
          variant={variant}
          className="w-100 rounded-0 text-start text-truncate"
        >
          <span className="me-1">#</span>
          {leoProfanity.clean(channel.name)}
        </Button>
      )}
    </li>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const currentChannelRef = useRef();
  const defaultChannelRef = useRef();
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const lastChannelId = useSelector(getLastChannelId);

  useEffect(() => {
    if (currentChannelId === defaultCurrentChannelId) {
      defaultChannelRef.current.scrollIntoView({ behavior: 'auto' });
    }
    if (currentChannelId === lastChannelId) {
      currentChannelRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [currentChannelId, lastChannelId]);

  const handleSetCurrentChannel = (id) => () => {
    dispatch(setCurrentChannel({ currentChannelId: id }));
  };

  const handleAddChannel = () => {
    dispatch(openModal({ type: 'adding' }));
  };

  const handleRemoveChannel = (id) => () => {
    dispatch(openModal({ type: 'removing', info: id }));
  };

  const handleRenameChannel = (id) => () => {
    dispatch(openModal({ type: 'renaming', info: id }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.channels')}</strong>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={handleAddChannel}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        <div ref={defaultChannelRef} />
        {channels.map((channel) => {
          const isActive = channel.id === currentChannelId;

          return (
            <Channel
              key={channel.id}
              channel={channel}
              isActive={isActive}
              handleSetCurrentChannel={handleSetCurrentChannel}
              handleRemoveChannel={handleRemoveChannel}
              handleRenameChannel={handleRenameChannel}
            />
          );
        })}
        <div ref={currentChannelRef} />
      </ul>
    </>
  );
};

export default Channels;
