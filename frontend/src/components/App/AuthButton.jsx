import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return auth.user && <Button onClick={auth.logOut}>{t('logout')}</Button>;
};

export default AuthButton;
