import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import validationSchema from './validationSchema';
import { useSocket } from '../../hooks';
import { getChannelsNames, getCurrentChannelName } from '../../selectors';

const Rename = (props) => {
  const { handleClose } = props;
  const id = useSelector((state) => state.modal.info);
  const channelsNames = useSelector(getChannelsNames);
  const currentChannelName = useSelector(getCurrentChannelName(id));
  const { t } = useTranslation();
  const { renameChannel } = useSocket();
  const rollbar = useRollbar();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: { name: currentChannelName },
    validationSchema: validationSchema(channelsNames),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      const newChannelName = {
        id,
        name,
      };

      try {
        await renameChannel(newChannelName);
        formik.resetForm();
        handleClose();
        toast.success(t('channels.renamed'));
      } catch (error) {
        rollbar.error('channel renaming', error, name);
        formik.setSubmitting(false);
        console.log(error);
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              id="name"
              className="mb-2"
              disabled={formik.isSubmitting}
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
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{t(formik.errors.name)}</div>
            )}
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

export default Rename;
