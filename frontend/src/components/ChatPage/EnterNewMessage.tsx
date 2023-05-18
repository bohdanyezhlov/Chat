import cn from 'classnames';
import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { object, string } from 'yup';

import { useAuth, useSocket } from '../../hooks';
import {
  AuthType,
  EnterNewMessageProps,
  RootState,
  SocketApiType,
} from '../../types';

const validationSchema = object().shape({
  body: string().trim().required('required').max(100, 'chat.messageTooLong'),
});

const EnterNewMessage = ({ channelId }: EnterNewMessageProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth() as AuthType;
  const { sendMessage } = useSocket() as SocketApiType;
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId]);

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      const filteredBody = leoProfanity.clean(body);
      const message = {
        body: filteredBody,
        channelId,
        username: auth.user?.username || '', // FIXME: ?
      };

      try {
        await sendMessage(message);
        formik.resetForm();
      } catch (error) {
        console.log(error);
        formik.setSubmitting(false);
      }
    },
  });
  console.log(
    formik.errors.body === t('chat.messageTooLong'),
    formik.errors.body,
    t('chat.messageTooLong')
  );
  const inputClass = cn('border-0 p-0 ps-2', {
    'text-white': currentTheme === 'dark',
    'text-dark': currentTheme === 'light',
    'bg-dark': currentTheme === 'dark',
    'bg-light': currentTheme === 'light',
    'is-invalid': formik.errors.body === 'chat.messageTooLong',
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup>
        <Form.Control
          name="body"
          className={inputClass}
          placeholder={t('chat.enterNewMessage')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          value={formik.values.body}
          ref={inputRef}
          aria-label={t('chat.newMessage')}
          autoComplete="off"
        />
        <div className="invalid-tooltip">{t(formik.errors.body || '')}</div>
        <Button
          type="submit"
          variant="group-vertical"
          disabled={!formik.isValid || !formik.dirty}
        >
          <ArrowRightSquare
            size={20}
            className={currentTheme === 'light' ? 'text-dark' : 'text-light'}
          />
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default EnterNewMessage;
