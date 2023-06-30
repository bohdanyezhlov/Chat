import cn from 'classnames';
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

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getLastChannelId } from '../../selectors';
import {
  defaultCurrentChannelId,
  setCurrentChannel,
} from '../../slices/channelsSlice';
import { openModal } from '../../slices/modalSlice';
import {
  ChannelProps,
  Channel as ChannelType,
  CustomButtonProps,
} from '../../types';

const CustomButton = (props: CustomButtonProps) => {
  const { handleSetCurrentChannel, channel, variant } = props;
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const btnClass = cn('w-100', 'rounded-start', 'text-start', 'text-truncate', {
    'text-white': currentTheme === 'dark' || variant === 'primary',
    'text-dark': currentTheme === 'light' && variant !== 'primary',
  });

  return (
    <Button
      onClick={handleSetCurrentChannel(channel.id)}
      type="button"
      variant={variant}
      className={btnClass}
    >
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  );
};

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

  return (
    <li className="nav-item w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <CustomButton
            handleSetCurrentChannel={handleSetCurrentChannel}
            channel={channel}
            variant={variant}
          />
          <Dropdown.Toggle
            split
            className="flex-grow-0"
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
        <CustomButton
          handleSetCurrentChannel={handleSetCurrentChannel}
          channel={channel}
          variant={variant}
        />
      )}
    </li>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const currentChannelRef = useRef<HTMLDivElement>(null);
  const defaultChannelRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { channels, currentChannelId } = useAppSelector(
    (state) => state.channels
  );
  const lastChannelId = useAppSelector(getLastChannelId);

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
      <ul className="nav flex-column nav-pills nav-fill px-2">
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
