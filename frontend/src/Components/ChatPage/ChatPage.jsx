import { useDispatch } from 'react-redux';
import { setInitialState as setChannelsInitialState } from '../../slices/channelsSlice';
import { setInitialState as setMessagesInitialState } from '../../slices/messagesSlice';
import axios from 'axios';
import { useEffect } from 'react';
import routes from '../../routes';
import { useAuth } from '../../hooks';
import Channels from './Channels';
import Messages from './Messages';

const ChatPage = () => {
  const dispatch = useDispatch();
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.dataPath(), {
          headers: auth.getAuthHeader(),
        });

        dispatch(setChannelsInitialState(response.data));
        dispatch(setMessagesInitialState(response.data));
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [auth, dispatch]); // TODO:

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <strong>Каналы</strong>
            {/* button add channel */}
          </div>

          <Channels />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <strong># Active channel name</strong>
              </p>
              <span className="text-muted">
                0 Counter messages in current channel
              </span>
            </div>
            <Messages />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
