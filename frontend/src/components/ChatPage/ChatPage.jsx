import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { setInitialState } from '../../slices/channelsSlice';
import routes from '../../routes';
import { useAuth } from '../../hooks';
import Channels from './Channels';
import Messages from './Messages';

const ChatPage = () => {
  const t = useTranslation();
  const rollbar = useRollbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.dataPath(), {
          headers: getAuthHeader(),
        });

        dispatch(setInitialState(response.data));
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        rollbar.error('getting init data', error);
        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
          return;
        }

        if (error.response.status === 401) {
          navigate(routes.loginPagePath());
        } else {
          toast.error(t('errors.network'));
        }
      }
    };

    fetchData();
  }, [getAuthHeader, dispatch, navigate, rollbar, t]);

  return isLoading ? (
    <div className="d-flex justify-content-center mt-5 h-100 align-items-center">
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
