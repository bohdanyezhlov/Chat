import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import init from './init';

const runApp = async () => {
  const container = document.getElementById('root') as HTMLElement;
  const root = createRoot(container);
  const Init = await init();

  root.render(<React.StrictMode>{Init}</React.StrictMode>);
};

runApp();
