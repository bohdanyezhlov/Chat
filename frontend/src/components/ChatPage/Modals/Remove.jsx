import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { useSocket } from '../../../hooks';

const Remove = (props) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const { onHide } = props;
  const { modalInfo: { item: id } } = props;
  const rollbar = useRollbar();

  const handleSubmit = async () => {
    try {
      await socket.emit('removeChannel', { id });
      onHide();
      toast.success(t('channels.removed'));
    } catch (error) {
      rollbar.error('channel renaming', error, id);
      console.log(error);
    }
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('modals.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn-secondary" onClick={onHide}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={handleSubmit} variant="danger">
            {t('modals.confirm')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
