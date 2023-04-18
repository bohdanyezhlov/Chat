import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import leoProfanity from 'leo-profanity';

import { setCurrentChannel } from '../../slices/channelsSlice';
import { openModal } from '../../slices/modalSlice';

const Channel = (props) => {
  const {
    name,
    removable,
    handleSetCurrentChannel,
    isActive,
    id,
    variant,
    t,
    currentChannelRef,
    handleRemoveChannel,
    handleRenameChannel,
  } = props;

  return (
    <li className="nav-item w-100" ref={isActive ? currentChannelRef : null}>
      {removable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            onClick={handleSetCurrentChannel(id)}
            type="button"
            variant={variant}
            className="w-100 rounded-0 text-start text-truncate"
          >
            <span className="me-1">#</span>
            {leoProfanity.clean(name)}
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
            <Dropdown.Item onClick={handleRemoveChannel(id)}>
              {t('channels.remove')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRenameChannel(id)}>
              {t('channels.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          onClick={handleSetCurrentChannel(id)}
          type="button"
          variant={variant}
          className="w-100 rounded-0 text-start text-truncate"
        >
          <span className="me-1">#</span>
          {leoProfanity.clean(name)}
        </Button>
      )}
    </li>
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const currentChannelRef = useRef();
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);

  useEffect(() => {
    currentChannelRef.current.scrollIntoView({ behavior: 'auto' });
  }, [channels.length]);

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
        {channels.map(({ id, name, removable }) => {
          const isActive = id === currentChannelId;
          const variant = isActive ? 'secondary' : '';

          return (
            <Channel
              key={id}
              id={id}
              name={name}
              removable={removable}
              isActive={isActive}
              variant={variant}
              handleSetCurrentChannel={handleSetCurrentChannel}
              currentChannelRef={currentChannelRef}
              t={t}
              handleRemoveChannel={handleRemoveChannel}
              handleRenameChannel={handleRenameChannel}
            />
          );
        })}
      </ul>
    </>
  );
};

export default Channels;
