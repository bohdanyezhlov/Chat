import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId
  );

  const handleSetCurrentChannel = (id) => {
    dispatch(setCurrentChannel({ currentChannelId: id }));
  };

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name }) => {
        const isActive = id === currentChannelId;

        return (
          <li key={id} className="nav-item w-100">
            <button
              onClick={() => handleSetCurrentChannel(id)}
              type="button"
              className={`w-100 rounded-0 text-start btn${
                isActive ? ' btn-secondary' : ''
              }`}
            >
              <span className="me-1">#</span>
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Channels;
