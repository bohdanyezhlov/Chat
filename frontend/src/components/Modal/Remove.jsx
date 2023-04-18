import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { useSelector } from 'react-redux';

import { useSocket } from '../../hooks';

const Remove = (props) => {
  const { t } = useTranslation();
  const { removeChannel } = useSocket();
  const [loading, setLoading] = useState(false);
  const { handleClose } = props;
  const id = useSelector((state) => state.modal.info);
  const rollbar = useRollbar();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await removeChannel({ id });
      handleClose();
      toast.success(t('channels.removed'));
    } catch (error) {
      setLoading(false);
      rollbar.error('channel renaming', error, id);
      console.log(error);
    }
  };

  return (
    <>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('modals.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn-secondary" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} variant="danger">
            {t('modals.confirm')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
