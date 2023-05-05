import { useTranslation } from 'react-i18next';

import notFoundImage from '../assets/notFoundImage.svg';
import routes from '../routes';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center h-100">
      <img
        alt={t('notFound.header')}
        className="img-fluid h-50"
        src={notFoundImage}
      />
      <h1 className="h4 text-muted">{t('notFound.header')}</h1>
      <p className="text-muted">
        {t('notFound.message')}{' '}
        <a href={routes.chatPagePath()}>{t('notFound.linkText')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
