const apiKey = import.meta.env.VITE_API_KEY;

export default {
  loginPath: () => [apiKey, 'login'].join('/'),
  signupPath: () => [apiKey, 'signup'].join('/'),
  dataPath: () => [apiKey, 'data'].join('/'),
  chatPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
};
