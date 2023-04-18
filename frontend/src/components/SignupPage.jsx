import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useAuth } from '../hooks';
import signupImage from '../assets/signupImage.jpg';
import routes from '../routes';

const Signup = () => {
  const rollbar = useRollbar();
  const auth = useAuth();
  const [signupFailed, setSignupFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('signup.required')
      .min(3, 'signup.usernameConstraints')
      .max(20, 'signup.usernameConstraints')
      .trim(),
    password: Yup.string()
      .required('signup.required')
      .min(6, 'signup.passMin')
      .trim(),
    confirmPassword: Yup.string()
      .required('signup.required')
      .oneOf([Yup.ref('password'), null], 'signup.mustMatch'),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      setSignupFailed(false);

      try {
        const response = await axios.post(routes.signupPath(), values);
        auth.logIn(response.data);
        navigate(routes.chatPagePath());
      } catch (error) {
        console.log(error);
        rollbar.error(t('errors.unknown'), error, values);

        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
          return;
        }

        if (error.response.status === 409) {
          setErrors({ confirmPassword: 'signup.alreadyExists' });
          setSignupFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('errors.network'));
          setSignupFailed(true);
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">

        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  className="rounded-circle"
                  alt={t('signup.header')}
                  src={signupImage}
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="w-50"
              >
                <h1 className="text-center mb-4">{t('signup.header')}</h1>
                <Form.Group
                  controlId="formBasicUsername"
                  className="form-floating mb-3"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder={t('signup.usernameConstraints')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    ref={inputRef}
                    required
                    isInvalid={
                    signupFailed
                    || (formik.touched.username && formik.errors.username)
                  }
                  />
                  <Form.Label>{t('signup.username')}</Form.Label>
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
                    placeholder={t('signup.passMin')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    required
                    isInvalid={
                    signupFailed
                    || (formik.touched.password && formik.errors.password)
                  }
                  />
                  <Form.Label>{t('signup.password')}</Form.Label>
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
                    placeholder={t('signup.mustMatch')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    required
                    isInvalid={
                    signupFailed
                    || (formik.touched.confirmPassword
                      && formik.errors.confirmPassword)
                  }
                  />
                  <Form.Label>{t('signup.confirm')}</Form.Label>
                  {formik.touched.confirmPassword
                  && formik.errors.confirmPassword && (
                    <div className="invalid-tooltip">
                      {t(formik.errors.confirmPassword)}
                    </div>
                  )}
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
