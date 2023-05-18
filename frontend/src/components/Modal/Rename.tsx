import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { Button, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useSocket } from '../../hooks';
import { getChannelsNames, getCurrentChannelName } from '../../selectors';
import { RenameProps, RootState, SocketApiType } from '../../types';
import validationSchema from './validationSchema';

const Rename = (props: RenameProps) => {
  const { handleClose } = props;
  const id = useSelector((state: RootState) => state.modal.info);
  const channelsNames = useSelector(getChannelsNames);
  const currentChannelName = useSelector(getCurrentChannelName(id));
  const { t } = useTranslation();
  const { renameChannel } = useSocket() as SocketApiType;
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const formik = useFormik({
    initialValues: { name: currentChannelName },
    validationSchema: validationSchema(channelsNames),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      const filteredName = leoProfanity.clean(name);
      const newChannelName = {
        id,
        name: filteredName,
      };

      try {
        await renameChannel(newChannelName);
        formik.resetForm();
        handleClose();
        toast.success(t('channels.renamed') as string);
      } catch (error) {
        console.log(error);
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Modal.Header
        closeButton
        onHide={handleClose}
        className={`bg-${currentTheme}`}
      >
        <Modal.Title>{t('modals.rename')}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={`bg-${currentTheme}`}>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              id="name"
              className="mb-2"
              disabled={formik.isSubmitting}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name || ''}
              name="name"
              isInvalid={!!formik.errors.name && formik.touched.name}
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
