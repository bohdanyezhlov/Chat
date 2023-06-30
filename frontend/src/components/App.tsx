import { Suspense, lazy, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthContext } from '../contexts';
import { useAuth } from '../hooks';
import routes from '../routes';
import { AuthType, ChildrenProps, RootState, UserData } from '../types';
import Loading from './Loading';
import LoginPage from './LoginPage';
import Modal from './Modal/Modal';
import Navbar from './Navbar';

const ChatPage = lazy(() => import('./ChatPage/ChatPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const SignupPage = lazy(() => import('./SignupPage'));

export const AuthProvider = ({ children }: ChildrenProps) => {
  const userJson = localStorage.getItem('user');
  const currentUser = userJson ? JSON.parse(userJson) : null;

  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null
  );

  const logIn = (userData: UserData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '');
    const token = userData?.token;

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const authService = useMemo(
    () => ({
      logIn,
      logOut,
      getAuthHeader,
      user,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }: ChildrenProps) => {
  const auth = useAuth() as AuthType;
  const location = useLocation();

  return auth.user ? (
    (children as JSX.Element) // FIXME: ?
  ) : (
    <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar />
          <Suspense fallback={<Loading />}>
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
              <Route path={routes.signupPagePath()} element={<SignupPage />} />
              <Route path={routes.loginPagePath()} element={<LoginPage />} />
            </Routes>
          </Suspense>
          <ToastContainer theme={currentTheme} />
          <Modal />
        </div>
      </Router>
    </AuthProvider>
  );
};
export default App;
