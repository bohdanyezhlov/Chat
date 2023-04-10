import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth, useSocket } from '../../hooks';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../slices/messagesSlice';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from '../../slices/channelsSlice';
import { useRollbar } from '@rollbar/react';

const validationSchema = Yup.object().shape({
  body: Yup.string().trim().required('required'),
});

const EnterNewMessage = ({ channelId }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const {
    user: { username },
  } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    inputRef.current.focus();
  }, [channelId]);

  // TODO: move to init.js
  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(addMessage({ message: payload }));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('newChannel', (payload) => {
      dispatch(addChannel({ name: payload }));
    });

    return () => {
      socket.off('newChannel');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('removeChannel', (payload) => {
      dispatch(removeChannel({ currentChannelId: payload }));
    });

    return () => {
      socket.off('removeChannel');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('renameChannel', (payload) => {
      dispatch(renameChannel({ updatedChannel: payload }));
    });

    return () => {
      socket.off('renameChannel');
    };
  }, [socket, dispatch]);

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
        await socket.volatile.emit('newMessage', message);
        formik.resetForm();
      } catch (error) {
        rollbar.error('sending new message', error, body);
        console.log(error);
      } finally {
        formik.setSubmitting(false);
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
        />
        <Button
          type="submit"
          variant="group-vertical"
          disabled={formik.touched.body && formik.errors.body}
        >
          {/* FIXME: remove border (disabled) */}
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default EnterNewMessage;
