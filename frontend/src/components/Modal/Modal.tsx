import { Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { closeModal } from '../../slices/modalSlice';
import { ModalTypes, RootState } from '../../types';
import Add from './Add';
import Remove from './Remove';
import Rename from './Rename';

const modalTypes: ModalTypes = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const Modal = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector((state: RootState) => state.modal.isOpened);
  const modalType = useSelector((state: RootState) => state.modal.type);

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (modalType === null) return null;
  const Component = modalTypes[modalType];

  return (
    <BootstrapModal
      show={isOpened}
      onHide={handleClose}
      centered
      restoreFocus={false}
    >
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
