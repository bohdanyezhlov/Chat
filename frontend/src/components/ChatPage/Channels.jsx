import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { PlusSquare } from 'react-bootstrap-icons';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import getModal from './Modals';

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
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channels);
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId
  );
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  const handleSetCurrentChannel = (id) => {
    dispatch(setCurrentChannel({ currentChannelId: id }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>Каналы</strong>
        <button
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => showModal('adding')}
        >
          <PlusSquare size={20} />
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map(({ id, name, removable }) => {
          const isActive = id === currentChannelId;
          const nameLength = name.length;

          return (
            <li key={id} className="nav-item w-100">
              {removable ? (
                <Dropdown as={ButtonGroup} className="d-flex">
                  <button
                    onClick={() => handleSetCurrentChannel(id)}
                    type="button"
                    className={`w-100 rounded-0 text-start btn ${
                      isActive ? ' btn-secondary' : ''
                    } ${nameLength > 12 ? 'text-truncate' : ''}`}
                    // FIXME: nameLength ? 5
                  >
                    <span className="me-1">#</span>
                    {name}
                  </button>
                  <Dropdown.Toggle
                    split
                    className="flex-grow-0"
                    variant={isActive ? ' btn-secondary' : null}
                  >
                    <span className="visually-hidden">Управление каналом</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => showModal('removing', id)}>
                      Удалить
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => showModal('renaming', id)}>
                      Переименовать
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <button
                  onClick={() => handleSetCurrentChannel(id)}
                  type="button"
                  className={`w-100 rounded-0 text-start btn${
                    isActive ? ' btn-secondary' : ''
                  } ${nameLength > 12 ? 'text-truncate' : ''}`}
                  // FIXME: nameLength ? 5
                >
                  <span className="me-1">#</span>
                  {name}
                </button>
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
