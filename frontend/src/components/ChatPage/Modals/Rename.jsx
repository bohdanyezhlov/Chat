import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSocket } from '../../../hooks';
import { Modal, FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const Rename = (props) => {
  const { onHide } = props;
  const id = props.modalInfo.item;
  const { t } = useTranslation();
  const socket = useSocket();
  const { channels } = useSelector((state) => state.channels);
  const channelsNames = channels.map(({ name }) => name);
  const [currentChannel] = channels.filter((c) => c.id === id);
  const currentChannelName = currentChannel.name;
  const rollbar = useRollbar();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
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
        toast.success(t('channels.renamed'));
      } catch (error) {
        rollbar.error('channel renaming', error, name);
        formik.setErrors({ name: error.message }); // FIXME: show error after submit
        console.log(error);
      }
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
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

export default Rename;
