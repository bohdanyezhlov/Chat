import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks';
import routes from '../../routes';
import { setInitialState } from '../../slices/channelsSlice';
import { AuthType } from '../../types';
import Loading from '../Loading';
import Channels from './Channels';
import Messages from './Messages';

const ChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth() as AuthType;
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
        console.log(error);

        if (!(error as AxiosError).isAxiosError) {
          toast.error(t('errors.unknown') as string);
          return;
        }

        if ((error as AxiosError).response?.status === 401) {
          navigate(routes.loginPagePath());
        } else {
          toast.error(t('errors.network') as string);
        }
      }
    };

    fetchData();
  }, [getAuthHeader, dispatch, navigate, t]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 flex-column h-100 d-flex">
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
