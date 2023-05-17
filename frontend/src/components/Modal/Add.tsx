import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { Button, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useSocket } from '../../hooks';
import { getChannelsNames } from '../../selectors';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { AddProps, SocketApiType } from '../../types';
import validationSchema from './validationSchema';

const Add = (props: AddProps) => {
  const { t } = useTranslation();
  const { handleClose } = props;
  const { addChannel } = useSocket() as SocketApiType;
  const channelsNames = useSelector(getChannelsNames);
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
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
        toast.success(t('channels.created') as string); // FIXME: ?
        formik.resetForm();
        handleClose();
      } catch (error) {
        console.log(error);
        formik.setSubmitting(false);
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
              isInvalid={!!formik.errors.name && formik.touched.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('modals.channelName')}
            </Form.Label>
            <div className="invalid-feedback">
              {t(formik.errors.name || '')}
            </div>
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
