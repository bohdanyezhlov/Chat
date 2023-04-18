import { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './Navbar';
import ChatPage from './ChatPage/ChatPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import NotFoundPage from './NotFoundPage';
import { useAuth } from '../hooks';
import { AuthContext } from '../contexts';
import Modal from './Modal/Modal';
import routes from '../routes';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null,
  );
  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  const authService = useMemo(
    () => ({
      logIn,
      logOut,
      getAuthHeader,
      user,
    }),
    [user],
  );

  return (
    <AuthContext.Provider
      value={authService}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.user ? (
    children
  ) : (
    <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Routes>
          <Route
            path={routes.chatPagePath()}
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
                )}
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path={routes.loginPagePath()} element={<LoginPage />} />
          <Route path={routes.signupPagePath()} element={<SignupPage />} />
        </Routes>
        <ToastContainer />
        <Modal />
      </div>
    </Router>
  </AuthProvider>
);

export default App;
