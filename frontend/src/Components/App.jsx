import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';

import ChatPage from './ChatPage/ChatPage';
import LoginPage from './LoginPage';
import NotFoundPage from './NotFoundPage';
import { AuthContext } from '../contexts';
import { useAuth } from '../hooks';
import routes from '../routes';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null
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

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        getAuthHeader,
        user,
      }}
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
    <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();

  return auth.user && <Button onClick={auth.logOut}>Выйти</Button>;
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Navbar.Brand as={Link} to={routes.chatPagePath()}>
              Hexlet Chat
            </Navbar.Brand>
            <AuthButton />
          </div>
        </Navbar>

        <Routes>
          <Route
            path={routes.chatPagePath()}
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path={routes.loginPagePath()} element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
