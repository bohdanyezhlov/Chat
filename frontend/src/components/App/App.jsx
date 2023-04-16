import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from '../Navbar';
import ChatPage from '../ChatPage/ChatPage';
import LoginPage from '../LoginPage';
import SignupPage from '../SignupPage';
import NotFoundPage from '../NotFoundPage';
import AuthProvider from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import Modal from '../Modal/Modal';
import routes from '../../routes';

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
