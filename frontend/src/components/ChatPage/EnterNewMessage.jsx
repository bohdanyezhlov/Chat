import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRollbar } from '@rollbar/react';

import { useAuth, useSocket } from '../../hooks';

const validationSchema = Yup.object().shape({
  body: Yup.string().trim().required('required'),
});

const EnterNewMessage = ({ channelId }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const inputRef = useRef();
  const {
    user: { username },
  } = useAuth();
  const { sendMessage } = useSocket();

  useEffect(() => {
    inputRef.current.focus();
  }, [channelId]);

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      const message = {
        body,
        channelId,
        username,
      };

      try {
        await sendMessage(message);
        formik.resetForm();
      } catch (error) {
        formik.setSubmitting(false);
        rollbar.error('sending new message', error, body);
        console.log(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup>
        <Form.Control
          name="body"
          className="border-0 p-0 ps-2"
          placeholder={t('chat.enterNewMessage')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          value={formik.values.body}
          ref={inputRef}
          aria-label={t('chat.newMessage')}
          autoComplete="off"
        />
        <Button
          type="submit"
          variant="group-vertical"
          disabled={!formik.isValid || !formik.dirty}
        >
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default EnterNewMessage;
