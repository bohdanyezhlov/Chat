import { render as renderComponent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { describe, expect, it, vi } from 'vitest';

import { store } from '../init';
import routes from '../routes';
import { AuthProvider } from './App';
import LoginPage from './LoginPage';
import Navbar from './Navbar';

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'en-US',
      },
    };
  },
}));

describe('Login', () => {
  const user = userEvent.setup();

  const render = (ui: ReactNode) => {
    return renderComponent(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  const server = setupServer(
    rest.post(routes.loginPath(), (_req, res, ctx) => {
      return res(ctx.json({ token: 'testToken', username: 'testUsername' }));
    })
  );

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render form', () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText('login.username');
    const passwordInput = screen.getByLabelText('login.password');
    const submitButton = screen.getByRole('button', { name: 'login.submit' });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle authorization error', async () => {
    server.use(
      // override the initial "POST /routes.loginPath()" request handler
      // to return a 401 Unauthorized Error
      rest.post(routes.loginPath(), (_req, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText('login.username');
    const passwordInput = screen.getByLabelText('login.password');
    const submitButton = screen.getByRole('button', { name: 'login.submit' });

    await user.type(usernameInput, 'wrongUsername');
    await user.type(passwordInput, 'wrongPassword');
    await user.click(submitButton);

    const errorTooltip = await screen.findByText('login.authFailed');
    expect(errorTooltip).toBeInTheDocument();
  });

  it('should handle server error', async () => {
    server.use(
      // override the initial "POST /routes.loginPath()" request handler
      // to return a 500 Server Error
      rest.post(routes.loginPath(), (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <>
        <ToastContainer />
        <LoginPage />
      </>
    );

    const usernameInput = screen.getByLabelText('login.username');
    const passwordInput = screen.getByLabelText('login.password');
    const submitButton = screen.getByRole('button', { name: 'login.submit' });

    await user.type(usernameInput, 'correctUsername');
    await user.type(passwordInput, 'correctPassword');
    await user.click(submitButton);

    const networkErrorTooltip = await screen.findByRole('alert');
    expect(networkErrorTooltip).toBeInTheDocument();
  });

  it('should handle successful authorization', async () => {
    render(
      <AuthProvider>
        <Navbar />
        <LoginPage />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText('login.username');
    const passwordInput = screen.getByLabelText('login.password');
    const submitButton = screen.getByRole('button', { name: 'login.submit' });

    await user.type(usernameInput, 'correctUsername');
    await user.type(passwordInput, 'correctPassword');
    await user.click(submitButton);

    const errorTooltip = await screen.findByRole('button', { name: 'logout' });
    expect(errorTooltip).toBeInTheDocument();
  });
});
