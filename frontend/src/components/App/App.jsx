import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import ChatPage from '../ChatPage/ChatPage';
import LoginPage from '../LoginPage';
import SignupPage from '../SignupPage';
import NotFoundPage from '../NotFoundPage';
import AuthProvider from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import AuthButton from './AuthButton';
import routes from '../../routes';

const App = () => {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <Navbar.Brand as={Link} to={routes.chatPagePath()}>
                {t('hexletChat')}
              </Navbar.Brand>
              <AuthButton />
            </div>
          </Navbar>

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
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
