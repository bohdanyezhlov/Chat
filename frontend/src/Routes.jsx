// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './Components/App';
import Login from './Components/Login';
import ErrorPage from './Components/ErrorPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
