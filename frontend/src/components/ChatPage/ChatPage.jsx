import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { setInitialState as setChannelsInitialState } from '../../slices/channelsSlice';
import { setInitialState as setMessagesInitialState } from '../../slices/messagesSlice'; // TODO: extraReducer?
import routes from '../../routes';
import { useAuth } from '../../hooks';
import Channels from './Channels';
import Messages from './Messages';

const ChatPage = () => {
  // TODO: order
  const rollbar = useRollbar();
  const dispatch = useDispatch();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.dataPath(), {
          headers: auth.getAuthHeader(),
        });

        dispatch(setChannelsInitialState(response.data));
        dispatch(setMessagesInitialState(response.data));
        setIsLoading(false);
      } catch (error) {
        rollbar.error('getting init data', error);
        console.log(error.message);
      }
    };

    fetchData();
  }, [auth, dispatch, rollbar]); // TODO: [empty or why]

  return isLoading ? (
    <div className="d-flex justify-content-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Messages />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
