import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './Routes';
import axios from 'axios';
import './index.css';

const rootElement = document.getElementById('root');
axios
  .post('/api/v1/login', { username: 'admin', password: 'admin' })
  .then((response) => {
    console.log(response.data); // => { token: ..., username: 'admin' }
  });
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
