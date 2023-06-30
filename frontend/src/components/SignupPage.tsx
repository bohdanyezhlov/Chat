import axios, { AxiosError } from 'axios';
import cn from 'classnames';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, ref, string } from 'yup';

import signupImage from '../assets/signupImage.jpg';
import { useAppSelector, useAuth } from '../hooks';
import routes from '../routes';
import { AuthType } from '../types';

const validationSchema = object().shape({
  username: string()
    .required('signup.required')
    .min(3, 'signup.usernameConstraints')
    .max(20, 'signup.usernameConstraints')
    .trim(),
  password: string()
    .required('signup.required')
    .min(6, 'signup.passMin')
    .trim(),
  confirmPassword: string()
    .required('signup.required')
    .oneOf([ref('password')], 'signup.mustMatch'),
});

const Signup = () => {
  const auth = useAuth() as AuthType;
  const [signupFailed, setSignupFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setSignupFailed(false);

      try {
        const response = await axios.post(routes.signupPath(), values);
        auth.logIn(response.data);
        navigate(routes.chatPagePath());
      } catch (error) {
        console.log(error);

        if (!(error as AxiosError).isAxiosError) {
          toast.error(t('errors.unknown') as string); // FIXME: ?
          return;
        }

        if ((error as AxiosError).response?.status === 409) {
          setSignupFailed(true);
          inputRef.current?.select();
        } else {
          toast.error(t('errors.network') as string); // FIXME: ?
        }
      }
    },
  });

  const cardClass = cn('card shadow-sm', {
    'bg-light': currentTheme === 'light',
    'bg-dark': currentTheme === 'dark',
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className={cardClass}>
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  className="rounded-circle"
                  alt={t('signup.header')}
                  src={signupImage}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('signup.header')}</h1>
                <Form.Group
                  controlId="formBasicUsername"
                  className="form-floating mb-3"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder={t('signup.usernameConstraints')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    ref={inputRef}
                    required
                    isInvalid={
                      signupFailed ||
                      (formik.touched.username && !!formik.errors.username)
                    }
                  />
                  <Form.Label className="text-dark">
                    {t('signup.username')}
                  </Form.Label>
                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-tooltip">
                      {t(formik.errors.username)}
                    </div>
                  )}
                </Form.Group>

                <Form.Group
                  controlId="formBasicPassword"
                  className="form-floating mb-3"
                >
                  <Form.Control
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder={t('signup.passMin')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    required
                    isInvalid={
                      signupFailed ||
                      (formik.touched.password && !!formik.errors.password)
                    }
                  />
                  <Form.Label className="text-dark">
                    {t('signup.password')}
                  </Form.Label>
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-tooltip">
                      {t(formik.errors.password)}
                    </div>
                  )}
                </Form.Group>

                <Form.Group
                  controlId="formConfirmPassword"
                  className="form-floating mb-4"
                >
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    autoComplete="current-password"
                    placeholder={t('signup.mustMatch')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    required
                    isInvalid={
                      signupFailed ||
                      (formik.touched.confirmPassword &&
                        !!formik.errors.confirmPassword)
                    }
                  />
                  <Form.Label className="text-dark">
                    {t('signup.confirm')}
                  </Form.Label>
                  <div className="invalid-tooltip">
                    {signupFailed
                      ? t('signup.alreadyExists')
                      : t(formik.errors.confirmPassword || '')}
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-100"
                >
                  {t('signup.submit')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
