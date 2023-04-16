/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useSocket } from '../../hooks';
import { setCurrentChannel } from '../../slices/channelsSlice';

const Add = (props) => {
  const { t } = useTranslation();
  const { handleClose } = props;
  const { addChannel } = useSocket();
  const channelsNames = useSelector((state) => state.channels.channels.map(({ name }) => name));
  const rollbar = useRollbar();
  const dispatch = useDispatch();

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
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      const newChannel = {
        name,
      };

      try {
        // eslint-disable-next-line no-unused-vars
        const { data } = await addChannel(newChannel);
        // console.log('Add:', data.id);
        // dispatch(setCurrentChannel({ currentChannelId: data.id }));
        toast.success(t('channels.created'));
        formik.resetForm();
        handleClose();
      } catch (error) {
        rollbar.error('channel adding', error, name);
        formik.setErrors({ name: error.message });
        formik.isSubmitting(false);
        console.log(error);
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton onHide={handleClose}>
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
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('modals.channelName')}
            </Form.Label>
            <div className="invalid-feedback">{t(formik.errors.name)}</div>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              className="me-2 btn-secondary"
              onClick={handleClose}
            >
              {t('modals.cancel')}
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {t('modals.submit')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </>
  );
};

export default Add;
