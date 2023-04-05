import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import routes from '../routes';
import useAuth from '../hooks';
import avatarImages from '../assets/avatar.jpg';

const LoginImage = () => {
  return (
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
      <img className="rounded-circle" alt="Login" src={avatarImages} />
    </div>
  );
};

const Login = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setAuthFailed(false);
      // setSubmitting(true); // TODO: do i need it?
      try {
        const response = await axios.post(routes.loginPath(), values);
        auth.logIn(response.data);
        const { from } = location.state || {
          from: { pathname: routes.chatPagePath() },
        };
        navigate(from);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          setErrors({ password: 'Неверные имя пользователя или пароль' });
          setAuthFailed(true);
          inputRef.current.select();
          return;
        } else if (error.isAxiosError) {
          setErrors({ password: 'Сеть не доступна' });
          setAuthFailed(true);
          return;
        }
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <LoginImage />
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Group
                  controlId="formBasicUsername"
                  className="form-floating mb-3"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    ref={inputRef}
                    required
                    isInvalid={authFailed}
                  />
                  <Form.Label>Ваш ник</Form.Label>
                </Form.Group>

                <Form.Group
                  controlId="formBasicPassword"
                  className="form-floating mb-4"
                >
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    required
                    isInvalid={authFailed}
                  />
                  <Form.Label>Пароль</Form.Label>
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-tooltip">
                      {formik.errors.password}
                    </div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-100 mb-3"
                >
                  Войти
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
