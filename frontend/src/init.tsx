import { Store, configureStore } from '@reduxjs/toolkit';
// import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import i18next from 'i18next';
import detector from 'i18next-browser-languagedetector';
import leoProfanity from 'leo-profanity';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import App from './components/App';
import { SocketContext } from './contexts';
import resources from './locales';
import reducer from './slices';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from './slices/channelsSlice';
import { addMessage } from './slices/messagesSlice';
import {
  AddChannelData,
  Channel,
  Message,
  RemoveChannelData,
  RenameChannelData,
  SendMessageData,
  SocketEventData,
  SocketResponseType,
} from './types';

const socketInit = (store: Store) => {
  const socket = io();

  socket.on('newMessage', (payload: Message) => {
    store.dispatch(addMessage({ message: payload }));
  });

  socket.on('newChannel', (payload: Channel) => {
    store.dispatch(addChannel({ channel: payload }));
  });

  socket.on('removeChannel', (payload: { id: number }) => {
    store.dispatch(removeChannel({ currentChannelId: payload }));
  });

  socket.on('renameChannel', (payload: Channel) => {
    store.dispatch(renameChannel({ updatedChannel: payload }));
  });

  const asyncEmit = (eventName: string, data: SocketEventData) =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 5000);

      socket.volatile.emit(eventName, data, (response: SocketResponseType) => {
        clearTimeout(timeout);

        if (response.status === 'ok') {
          resolve(response);
        }

        reject();
      });
    });

  const socketApi = {
    sendMessage: (data: SendMessageData) => asyncEmit('newMessage', data),
    addChannel: (data: AddChannelData) => asyncEmit('newChannel', data),
    removeChannel: (data: RemoveChannelData) =>
      asyncEmit('removeChannel', data),
    renameChannel: (data: RenameChannelData) =>
      asyncEmit('renameChannel', data),
  };

  return socketApi;
};

const init = async () => {
  // const isProduction = process.env.NODE_ENV === 'production';

  const i18n = i18next.createInstance();

  await i18n.use(detector).use(initReactI18next).init({
    fallbackLng: 'en',
    resources,
  });

  // @ts-expect-error: Unreachable code error
  leoProfanity.add(leoProfanity.getDictionary('en'));
  // @ts-expect-error: Unreachable code error
  leoProfanity.add(leoProfanity.getDictionary('fr'));
  // @ts-expect-error: Unreachable code error
  leoProfanity.add(leoProfanity.getDictionary('ru'));

  const store = configureStore({
    reducer,
  });

  const socketApi = socketInit(store);

  // const rollbarConfig = {
  //   enabled: isProduction,
  //   accessToken: import.meta.env.ROLLBAR_TOKEN,
  // };

  return (
    // <RollbarProvider config={rollbarConfig}>
    // <ErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <SocketContext.Provider value={socketApi}>
          <App />
        </SocketContext.Provider>
      </Provider>
    </I18nextProvider>
    // </ErrorBoundary>
    // </RollbarProvider>
  );
};

export default init;
