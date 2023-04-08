import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialState as setChannelsInitialState } from '../../slices/channelsSlice';
import { setInitialState as setMessagesInitialState } from '../../slices/messagesSlice'; // TODO: extraReducer?
import axios from 'axios';
import { useEffect } from 'react';
import routes from '../../routes';
import { useAuth } from '../../hooks';
import Channels from './Channels';
import Messages from './Messages';
import { Spinner } from 'react-bootstrap';

const ChatPage = () => {
  // TODO: order
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
        console.log(error.message);
      }
    };

    fetchData();
  }, [auth, dispatch]); // TODO: [empty or why]

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
            <Messages />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
