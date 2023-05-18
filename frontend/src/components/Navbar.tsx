import { useEffect, useState } from 'react';
import { Navbar as BootstrapNavbar, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks';
import routes from '../routes';
import { setTheme } from '../slices/themeSlice';
import { AuthType, RootState } from '../types';

const getBodyClass = (theme: string) => {
  const dark = 'text-white bg-dark h-100';
  const light = 'text-dark bg-light h-100';

  return theme === 'light' ? light : dark;
};

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const [bodyClass, setBodyClass] = useState(currentTheme);

  useEffect(() => {
    document.body.className = getBodyClass(bodyClass);
  }, [bodyClass]);

  useEffect(() => {
    const defaultTheme = localStorage.getItem('theme');
    if (defaultTheme) {
      const parsedTheme = JSON.parse(defaultTheme);
      dispatch(setTheme(parsedTheme));
      setBodyClass(parsedTheme);
    }
  }, [dispatch]);

  const handleThemeSwitch = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', JSON.stringify(newTheme));
    setBodyClass(newTheme);
  };

  return (
    <Button variant="primary" onClick={handleThemeSwitch}>
      {currentTheme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

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
  const auth = useAuth() as AuthType; // FIXME: ?
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
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  return (
    <BootstrapNavbar expand="lg" className="shadow-sm" variant={currentTheme}>
      <div className="container">
        <BootstrapNavbar.Brand as={Link} to={routes.chatPagePath()}>
          {t('logoChat')}
        </BootstrapNavbar.Brand>
        <div className="d-flex align-items-center">
          <LangSwitcher />
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
