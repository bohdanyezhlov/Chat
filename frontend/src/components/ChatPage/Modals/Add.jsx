import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSocket } from '../../../hooks';
import { Modal, FormGroup, FormControl, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../../slices/channelsSlice';

const Add = (props) => {
  const { onHide } = props;
  const dispatch = useDispatch();
  const socket = useSocket();
  const { channels } = useSelector((state) => state.channels);
  const channelsNames = channels.map(({ name }) => name);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
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
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async ({ name }) => {
      const newChannel = {
        name,
      };

      try {
        await socket.volatile.emit('newChannel', newChannel, ({ data }) => {
          setTimeout(() => {
            // FIXME: timeout?
            dispatch(setCurrentChannel({ currentChannelId: data.id }));
          }, 30);
        });
        formik.resetForm();
        onHide();
      } catch (error) {
        formik.setErrors({ name: error.message }); // FIXME: show error after submit
        console.log(error);
      } finally {
      }
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
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

export default Add;
