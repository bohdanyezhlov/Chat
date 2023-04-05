import { useDispatch } from 'react-redux';
import { setInitialState } from '../slices/channelsSlice';
import axios from 'axios';
import { useEffect } from 'react';
import routes from '../routes';
import useAuth from '../hooks';

const ChatPage = () => {
  // const channels = useSelector((state) => state.channels.channels);
  const dispatch = useDispatch();
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.dataPath(), {
          headers: auth.getAuthHeader(),
        });

        dispatch(setInitialState(response.data));
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [auth, dispatch]); // TODO:
};

export default ChatPage;
