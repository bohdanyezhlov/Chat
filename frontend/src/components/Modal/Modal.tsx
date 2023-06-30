import { Modal as BootstrapModal } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { closeModal } from '../../slices/modalSlice';
import { ModalTypes } from '../../types';
import Add from './Add';
import Remove from './Remove';
import Rename from './Rename';

const modalTypes: ModalTypes = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const Modal = () => {
  const dispatch = useAppDispatch();
  const isOpened = useAppSelector((state) => state.modal.isOpened);
  const modalType = useAppSelector((state) => state.modal.type);

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
