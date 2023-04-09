import { useSocket } from '../../../hooks';
import { Modal, Button } from 'react-bootstrap';

const Remove = (props) => {
  const socket = useSocket();
  const { onHide } = props;
  const id = props.modalInfo.item;

  const handleSubmit = (e) => {
    e.preventDefault(); // FIXME: ?
    socket.emit('removeChannel', { id });
    onHide();
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn-secondary"
              onClick={onHide}
            >
              Отменить
            </Button>
            <Button type="submit" variant="danger">
              Удалить
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
