import cn from 'classnames';
import { useFormik } from 'formik';
import leoProfanity from 'leo-profanity';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

import { useAppSelector, useAuth, useSocket } from '../../hooks';
import { AuthType, EnterNewMessageProps, SocketApiType } from '../../types';

const validationSchema = object().shape({
  body: string().trim().required('required').max(100, 'chat.messageTooLong'),
});

const EnterNewMessage = ({ channelId }: EnterNewMessageProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);
  const auth = useAuth() as AuthType;
  const { sendMessage } = useSocket() as SocketApiType;
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId, focus]);

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      setFocus(false);
      const filteredBody = leoProfanity.clean(body);
      const message = {
        body: filteredBody,
        createdAt: new Date(),
        channelId,
        username: auth.user?.username || '', // FIXME: ?
      };

      try {
        await sendMessage(message);
        formik.resetForm();
        setFocus(true);
      } catch (error) {
        console.log(error);
        formik.setSubmitting(false);
      }
    },
  });

  const inputClass = cn('border-0 p-0 ps-2 shadow-none', {
    'text-white': currentTheme === 'dark',
    'text-dark': currentTheme === 'light',
    'bg-dark': currentTheme === 'dark',
    'bg-light': currentTheme === 'light',
    'is-invalid': formik.errors.body === 'chat.messageTooLong',
  });

  const buttonIconClass = cn('', {
    'text-success': !formik.isSubmitting && formik.isValid && formik.dirty,
    'text-white': currentTheme === 'dark' && !(formik.isValid && formik.dirty),
    'text-dark': currentTheme === 'light' && !(formik.isValid && formik.dirty),
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
          className="border-0"
          disabled={!formik.isValid || !formik.dirty}
        >
          <ArrowRightSquare size={20} className={buttonIconClass} />
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default EnterNewMessage;
