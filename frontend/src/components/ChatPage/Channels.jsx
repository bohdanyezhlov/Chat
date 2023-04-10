import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import leoProfanity from 'leo-profanity';
import getModal from './Modals';
import { setCurrentChannel } from '../../slices/channelsSlice';

const renderModal = ({ modalInfo, hideModal, setItems }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return (
    <Component modalInfo={modalInfo} setItems={setItems} onHide={hideModal} />
  );
};

const Channels = () => {
  const { t } = useTranslation();
  const currentChannelRef = useRef();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channels);
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId,
  );
  const [modalInfo, setModalInfo] = useState({ type: null });
  const hideModal = () => setModalInfo({ type: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  useEffect(() => {
    currentChannelRef.current.scrollIntoView({ behavior: 'auto' });
  }, [channels]);

  const handleSetCurrentChannel = (id) => {
    dispatch(setCurrentChannel({ currentChannelId: id }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.channels')}</strong>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={() => showModal('adding')}
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
            <li key={id} className="nav-item w-100" ref={isActive ? currentChannelRef : null}>
              {removable ? (
                <Dropdown as={ButtonGroup} className="d-flex">
                  <Button
                    onClick={() => handleSetCurrentChannel(id)}
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
                    <Dropdown.Item onClick={() => showModal('removing', id)}>
                      {t('channels.remove')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => showModal('renaming', id)}>
                      {t('channels.rename')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  onClick={() => handleSetCurrentChannel(id)}
                  type="button"
                  variant={variant}
                  className="w-100 rounded-0 text-start text-truncate"
                  // FIXME: nameLength ? 5
                >
                  <span className="me-1">#</span>
                  {leoProfanity.clean(name)}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {renderModal({ modalInfo, hideModal })}
    </>
  );
};

export default Channels;
