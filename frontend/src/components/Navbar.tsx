import { Navbar as BootstrapNavbar, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks';
import routes from '../routes';

const LangSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleChangeLanguage = (lang: string) => () => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <Dropdown drop="start" className="mx-2">
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {i18n.language.split('-')[0].toUpperCase()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          as={Button}
          onClick={handleChangeLanguage('en')}
          active={i18n.language === 'en'}
        >
          {t('english')}
        </Dropdown.Item>
        <Dropdown.Item
          as={Button}
          onClick={handleChangeLanguage('ua')}
          active={i18n.language === 'ua'}
        >
          {t('ukrainian')}
        </Dropdown.Item>
        <Dropdown.Item
          as={Button}
          onClick={handleChangeLanguage('pl')}
          active={i18n.language === 'pl'}
        >
          {t('polish')}
        </Dropdown.Item>
        <Dropdown.Item
          as={Button}
          onClick={handleChangeLanguage('ru')}
          active={i18n.language === 'ru'}
        >
          {t('russian')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.user && (
      <Button onClick={auth.logOut} className="mx-2">
        {t('logout')}
      </Button>
    )
  );
};

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to={routes.chatPagePath()}>
          {t('logoChat')}
        </BootstrapNavbar.Brand>
        <div className="d-flex align-items-center">
          <LangSwitcher />
          <AuthButton />
        </div>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
