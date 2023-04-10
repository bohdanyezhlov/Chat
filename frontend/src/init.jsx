import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import resources from './locales';
import store from './slices';
// import { addMessage } from './slices/messagesSlice';
// import {
//   addChannel,
//   renameChannel,
//   removeChannel,
// } from './slices/channelsSlice';
import { SocketContext } from './contexts';
import App from './components/App';

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  // const dispatch = useDispatch();
  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    lng: 'ru',
    resources, // eng?
  });

  const socket = io();

  // socket.on('newMessage', (payload) => {
  //   dispatch(addMessage({ message: payload }));
  // });

  // socket.on('newChannel', (payload) => {
  //   dispatch(addChannel({ name: payload }));
  // });

  // socket.on('removeChannel', (payload) => {
  //   dispatch(removeChannel({ currentChannelId: payload }));
  // });

  // socket.on('renameChannel', (payload) => {
  //   dispatch(renameChannel({ updatedChannel: payload }));
  // });

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <App />
        </SocketContext.Provider>
      </Provider>
    </I18nextProvider>
  );
};
