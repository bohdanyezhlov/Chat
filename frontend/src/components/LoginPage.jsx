import { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import routes from '../routes';
import { useAuth } from '../hooks';
import loginImage from '../assets/loginImage.jpg';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const Login = () => {
  const rollbar = useRollbar();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: async (values, { setErrors }) => {
      setAuthFailed(false);

      try {
        const response = await axios.post(routes.loginPath(), values);
        auth.logIn(response.data);
        const { from } = location.state || {
          from: { pathname: routes.chatPagePath() },
        };
        navigate(from);
      } catch (error) {
        console.log(error);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          // setErrors({ password: 'login.authFailed' }); // FIXME: only onClick
          inputRef.current.select();
          rollbar.error(t('login.authFailed'), error, values);
          return;
        } else if (error.isAxiosError) {
          toast.error(t('errors.network'));
          return;
        }
        toast.error(t('errors.unknown'));
        rollbar.error(t('errors.unknown'), error, values);
        throw error;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  className="rounded-circle"
                  alt={t('login.header')}
                  src={loginImage}
                />
              </div>

              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('login.header')}</h1>
                <Form.Group
                  controlId="formBasicUsername"
                  className="form-floating mb-3"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder={t('login.username')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    ref={inputRef}
                    required
                    isInvalid={authFailed}
                  />
                  <Form.Label>{t('login.username')}</Form.Label>
                </Form.Group>

                <Form.Group
                  controlId="formBasicPassword"
                  className="form-floating mb-4"
                >
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder={t('login.password')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    required
                    isInvalid={authFailed}
                  />
                  <Form.Label>{t('login.password')}</Form.Label>
                  {authFailed && (
                    <div className="invalid-tooltip">
                      {t('login.authFailed')}
                    </div>
                  )}
                  {/* {authFailed && (
                    <div className="invalid-tooltip">
                      {t(formik.errors.password)}
                    </div>
                  )} */}
                </Form.Group>

                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-100 mb-3"
                >
                  {t('login.submit')}
                </Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.newToChat')}</span>{' '}
                <Link to={routes.signupPagePath()}>{t('login.signup')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
