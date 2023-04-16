import { Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../hooks';
import routes from '../routes';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return auth.user && <Button onClick={auth.logOut}>{t('logout')}</Button>;
};

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <BootstrapNavbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to={routes.chatPagePath()}>
          {t('hexletChat')}
        </BootstrapNavbar.Brand>
        <AuthButton />
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
