import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import leoProfanity from 'leo-profanity';

import validationSchema from './validationSchema';
import { useSocket } from '../../hooks';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { getChannelsNames } from '../../selectors';

const Add = (props) => {
  const { t } = useTranslation();
  const { handleClose } = props;
  const { addChannel } = useSocket();
  const channelsNames = useSelector(getChannelsNames);
  const rollbar = useRollbar();
  const dispatch = useDispatch();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: validationSchema(channelsNames),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      const filteredName = leoProfanity.clean(name);
      const newChannel = {
        name: filteredName,
      };

      try {
        const { data } = await addChannel(newChannel);
        dispatch(setCurrentChannel({ currentChannelId: data.id }));
        toast.success(t('channels.created'));
        formik.resetForm();
        handleClose();
      } catch (error) {
        rollbar.error('channel adding', error, name);
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
