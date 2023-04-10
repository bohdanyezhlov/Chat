import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSocket } from '../../../hooks';
import { Modal, FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../../slices/channelsSlice';
import { toast } from 'react-toastify';

const Add = (props) => {
  const { t } = useTranslation();
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
      .min(3, 'modals.min')
      .max(20, 'modals.max')
      .notOneOf(channelsNames, 'modals.uniq')
      .required('modals.required'),
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
            toast.success(t('channels.created'));
          }, 30);
        });
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
        <Modal.Title>{t('modals.add')}</Modal.Title>
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
            <Form.Label className="visually-hidden">
              {t('modals.channelName')}
            </Form.Label>
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-tooltip">{t(formik.errors.name)}</div>
            )}
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn-secondary"
              onClick={onHide}
            >
              {t('modals.cancel')}
            </Button>
            <Button type="submit">{t('modals.submit')}</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
