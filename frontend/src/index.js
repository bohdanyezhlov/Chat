import React from 'react';
import { createRoot } from 'react-dom/client';
import init from './init';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const runApp = async () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  const Init = await init();

  root.render(<React.StrictMode>{Init}</React.StrictMode>);
};

runApp();
