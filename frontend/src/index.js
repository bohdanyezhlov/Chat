import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'
import init from './init';
import './index.css';

const runApp = async () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  const Init = await init();

  const rollbarConfig = {
    accessToken: 'cb1dc2e34ce247c08ca8da81e515c349', // FIXME: how to hide it?
    environment: 'testenv',
  };

  root.render(
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <React.StrictMode>{Init}</React.StrictMode>
      </ErrorBoundary>
    </Provider>,
  );
};

runApp();
