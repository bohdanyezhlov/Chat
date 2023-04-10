import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks';
import { Form, Button } from 'react-bootstrap';
import signupImage from '../assets/signupImage.jpg';
import routes from '../routes';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

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
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSignupFailed(false);

      try {
        const response = await axios.post(routes.signupPath(), values);
        auth.logIn(response.data);
        navigate(routes.chatPagePath());
      } catch (error) {
        console.log(error);
        if (error.isAxiosError && error.response.status === 409) {
          setErrors({ confirmPassword: 'signup.alreadyExists' });
          setSignupFailed(true);
          inputRef.current.select();
          rollbar.error(t('signup.alreadyExists'), error, values);
          return;
        } else if (error.isAxiosError) {
          toast.error(t('errors.network'));
          // setErrors({ confirmPassword: 'errors.network' });
          setSignupFailed(true); // FIXME: remove it?
          return;
        }
        // setErrors({ confirmPassword: 'errors.unknown' }); // FIXME: ?
        throw error;
      }
    },
  });

  return (
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img
                className="rounded-circle"
                alt={t('signup.header')}
                src={signupImage}
              />
            </div>
            <Form
              onSubmit={formik.handleSubmit}
              className="col-12 col-md-6 mt-3 mt-mb-0"
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
                    signupFailed ||
                    (formik.touched.username && formik.errors.username)
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
                className="form-floating mb-4"
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
                    signupFailed ||
                    (formik.touched.password && formik.errors.password)
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
                    signupFailed ||
                    (formik.touched.confirmPassword &&
                      formik.errors.confirmPassword)
                  }
                />
                <Form.Label>{t('signup.confirm')}</Form.Label>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="invalid-tooltip">
                      {t(formik.errors.confirmPassword)}
                    </div>
                  )}
              </Form.Group>

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-100 mb-3"
              >
                {t('signup.submit')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
