import { useSocket } from '../../../hooks';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Remove = (props) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const { onHide } = props;
  const id = props.modalInfo.item;

  const handleSubmit = (e) => {
    e.preventDefault(); // FIXME: ?
    socket.emit('removeChannel', { id });
    onHide();
    toast.success(t('channels.removed'));
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <p className="lead">{t('modals.confirmation')}</p>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn-secondary"
              onClick={onHide}
            >
              {t('modals.cancel')}
            </Button>
            <Button type="submit" variant="danger">
              {t('modals.confirm')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
