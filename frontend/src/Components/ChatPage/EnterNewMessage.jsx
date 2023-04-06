import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../slices/messagesSlice';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth, useSocket } from '../../hooks';

const validationSchema = Yup.object().shape({
  body: Yup.string().trim().required('Body is required'),
});

const EnterNewMessage = ({ channelId }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const {
    user: { username },
  } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    inputRef.current.focus(); // TODO: individual useEffect?

    socket.on('newMessage', (payload) => {
      dispatch(addMessage({ message: payload }));
    });

    return () => {
      socket.off('newMessage');
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
        await socket.emit('newMessage', message);
        formik.resetForm();
      } catch (error) {
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
          placeholder="Введите сообщение..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          value={formik.values.body}
          ref={inputRef}
          aria-label="Новое сообщение"
        />
        <Button
          type="submit"
          variant="group-vertical"
          disabled={formik.touched.body && formik.errors.body}
        >
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">Отправить</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default EnterNewMessage;
