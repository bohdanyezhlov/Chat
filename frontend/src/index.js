import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './Routes';
import './index.css';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
