import { useSelector } from 'react-redux';

const Channels = () => {
  const channels = useSelector((state) => state.channels.channels);

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map(({ id, name }) => {
        return (
          <li key={id} className="nav-item w-100">
            <button type="button" className="w-100 rounded-0 text-start btn">
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
