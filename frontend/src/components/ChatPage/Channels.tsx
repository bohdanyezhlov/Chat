import { useEffect, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getLastChannelId } from '../../selectors';
import {
  defaultCurrentChannelId,
  setCurrentChannel,
} from '../../slices/channelsSlice';
import { openModal } from '../../slices/modalSlice';
import { ChannelProps, Channel as ChannelType, RootState } from '../../types';

const Channel = (props: ChannelProps) => {
  const {
    channel,
    isActive,
    handleSetCurrentChannel,
    handleRemoveChannel,
    handleRenameChannel,
  } = props;
  const { t } = useTranslation();
  const variant = isActive ? 'primary' : '';
  const buttonClass = 'w-100 rounded text-start text-truncate';

  return (
    <li className="nav-item w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            onClick={handleSetCurrentChannel(channel.id)}
            type="button"
            variant={variant}
            className={buttonClass}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle
            split
            className="flex-grow-0 position-absolute end-0"
            variant={variant}
            style={{ zIndex: 1 }}
          >
            <span className="visually-hidden">{t('channels.menu')}</span>
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
          className={buttonClass}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      )}
    </li>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const currentChannelRef = useRef<HTMLDivElement>(null);
  const defaultChannelRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector(
    (state: RootState) => state.channels
  );
  const lastChannelId = useSelector(getLastChannelId);

  useEffect(() => {
    if (currentChannelId === defaultCurrentChannelId) {
      defaultChannelRef.current?.scrollIntoView({ behavior: 'auto' });
    }
    if (currentChannelId === lastChannelId) {
      currentChannelRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [currentChannelId, lastChannelId]);

  const handleSetCurrentChannel = (id: number) => () => {
    dispatch(setCurrentChannel({ currentChannelId: id }));
  };

  const handleAddChannel = () => {
    dispatch(openModal({ type: 'adding' }));
  };

  const handleRemoveChannel = (id: number) => () => {
    dispatch(openModal({ type: 'removing', info: id }));
  };

  const handleRenameChannel = (id: number) => () => {
    dispatch(openModal({ type: 'renaming', info: id }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.channels')}</strong>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 200 }}
          overlay={
            <Tooltip id="add-channel-tooltip">{t('modals.add')}</Tooltip>
          }
        >
          <Button
            type="button"
            variant="group-vertical"
            className="p-0 text-primary"
            onClick={handleAddChannel}
          >
            <PlusSquare size={20} />
            <span className="visually-hidden">+</span>
          </Button>
        </OverlayTrigger>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        <div ref={defaultChannelRef} />
        {channels.map((channel: ChannelType) => {
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