import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSocket } from '../../../hooks';
import { Modal, FormGroup, FormControl, Button } from 'react-bootstrap';

const Rename = (props) => {
  const { onHide } = props;
  const id = props.modalInfo.item;
  const socket = useSocket();
  const { channels } = useSelector((state) => state.channels);
  const channelsNames = channels.map(({ name }) => name);
  const [currentChannel] = channels.filter((c) => c.id === id);
  const currentChannelName = currentChannel.name;

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channelsNames, 'Должно быть уникальным')
      .required('Обязательное поле'),
  });

  const formik = useFormik({
    initialValues: { name: currentChannelName },
    validationSchema,
    onSubmit: async ({ name }) => {
      const newChannelName = {
        id, // FIXME: channelId is not working
        name,
      };
      try {
        await socket.emit('renameChannel', newChannelName);
        formik.resetForm();
        onHide();
      } catch (error) {
        formik.setErrors({ name: error.message }); // FIXME: show error after submit
        console.log(error);
      }
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              className="mb-2"
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
            />
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn-secondary"
              onClick={onHide}
            >
              Отменить
            </Button>
            <Button type="submit">Отправить</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
