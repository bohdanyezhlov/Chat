import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  // const navigate = useNavigate();

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    login: Yup.string()
      // .min(3, "Login must be at least 3 characters")
      // .max(20, "Login must be less than or equal to 20 characters")
      .required('Login is required'),
    password: Yup.string()
      // .min(6, "Password must be at least 6 characters")
      .required('Password is required'),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values); // Do something with the form data
    setSubmitting(false);
    // navigate('/dashboard'); // Navigate to dashboard page on successful login
  };

  return (
    <Formik
      initialValues={{ login: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <div className="flex justify-center items-center h-screen">
          <Form className="w-1/3 max-w-md mx-auto p-4 bg-gray-200 rounded-lg shadow-lg">
            <div className="mb-4">
              <label
                htmlFor="login"
                className="block font-medium text-gray-800 mb-2"
              >
                Login
              </label>
              <Field
                type="text"
                name="login"
                className="w-full p-2 rounded-lg border border-gray-400 shadow-sm text-gray-800 focus:outline-none focus:border-indigo-500"
              />
              <ErrorMessage name="login" className="text-red-500 mt-1" />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block font-medium text-gray-800 mb-2"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 rounded-lg border border-gray-400 shadow-sm text-gray-800 focus:outline-none focus:border-indigo-500"
              />
              <ErrorMessage name="password" className="text-red-500 mt-1" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default Login;
