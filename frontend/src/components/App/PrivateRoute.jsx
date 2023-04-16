import { useLocation, Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks';
import routes from '../../routes';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.user ? (
    children
  ) : (
    <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

export default PrivateRoute;
