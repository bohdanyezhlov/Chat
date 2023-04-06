import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './components/App';
import store from './slices';
import { SocketContext } from './contexts';

const container = document.getElementById('root');
const root = createRoot(container);
const socket = io();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <App />
      </SocketContext.Provider>
    </Provider>
  </React.StrictMode>
);
