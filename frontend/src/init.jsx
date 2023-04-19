import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
// import detector from 'i18next-browser-languagedetector';
import io from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import leoProfanity from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import reducer from './slices';
import resources from './locales';
import { SocketContext } from './contexts';
import { addMessage } from './slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';
import App from './components/App';

export default async () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const i18n = i18next.createInstance();

  await i18n
    // .use(detector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'ru',
      resources,
    });

  leoProfanity.add(leoProfanity.getDictionary('en'));
  leoProfanity.add(leoProfanity.getDictionary('fr'));
  leoProfanity.add(leoProfanity.getDictionary('ru'));

  const store = configureStore({
    reducer,
  });

  const socket = io();

  const asyncEmit = (eventName, data) => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 5000);

    socket.volatile.emit(eventName, data, (response) => {
      clearTimeout(timeout);

      if (response.status === 'ok') {
        resolve(response);
      }

      reject();
    });
  });

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const socketApi = {
    sendMessage: (data) => asyncEmit('newMessage', data),
    addChannel: (data) => asyncEmit('newChannel', data),
    removeChannel: (data) => asyncEmit('removeChannel', data),
    renameChannel: (data) => asyncEmit('renameChannel', data),
  };

  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage({ message: payload }));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(addChannel({ channel: payload }));
  });

  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel({ currentChannelId: payload }));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel({ updatedChannel: payload }));
  });

  const rollbarConfig = {
    enabled: isProduction,
    accessToken: process.env.ROLLBAR_TOKEN,
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <SocketContext.Provider value={socketApi}>
              <App />
            </SocketContext.Provider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
