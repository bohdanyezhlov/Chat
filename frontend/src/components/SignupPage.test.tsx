import { render as renderComponent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { describe, expect, it } from 'vitest';

import routes from '../routes';
import { store } from '../slices';
import { AuthProvider } from './App';
import Navbar from './Navbar';
import Signup from './SignupPage';

describe('Signup', () => {
  const user = userEvent.setup();

  const render = (ui: ReactNode) => {
    return renderComponent(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  const server = setupServer(
    rest.post(routes.signupPath(), (_req, res, ctx) => {
      return res(ctx.json({ token: 'testToken', username: 'testUsername' }));
    })
  );

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render form', () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText('signup.username');
    const passwordInput = screen.getByLabelText('signup.password');
    const confirmPasswordInput = screen.getByLabelText('signup.confirm');
    const submitButton = screen.getByRole('button', { name: 'signup.submit' });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    render(
      <AuthProvider>
        <Navbar />
        <Signup />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText('signup.username');
    const passwordInput = screen.getByLabelText('signup.password');
    const confirmPasswordInput = screen.getByLabelText('signup.confirm');
    const submitButton = screen.getByRole('button', { name: 'signup.submit' });

    await user.type(usernameInput, 'correctUsername');
    await user.type(passwordInput, 'correctPassword');
    await user.type(confirmPasswordInput, 'correctPassword');
    await user.click(submitButton);

    const logoutButton = await screen.findByRole('button', { name: 'logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should handle server error', async () => {
    server.use(
      // override the initial "POST /routes.signupPath()" request handler
      // to return a 500 Server Error
      rest.post(routes.signupPath(), (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <>
        <ToastContainer />
        <Signup />
      </>
    );

    const usernameInput = screen.getByLabelText('signup.username');
    const passwordInput = screen.getByLabelText('signup.password');
    const confirmPasswordInput = screen.getByLabelText('signup.confirm');
    const submitButton = screen.getByRole('button', { name: 'signup.submit' });

    await user.type(usernameInput, 'correctUsername');
    await user.type(passwordInput, 'correctPassword');
    await user.type(confirmPasswordInput, 'correctPassword');
    await user.click(submitButton);

    const networkErrorTooltip = await screen.findByRole('alert');
    expect(networkErrorTooltip).toBeInTheDocument();
  });

  it('should handle conflict error', async () => {
    server.use(
      // override the initial "POST /routes.signupPath()" request handler
      // to return a 409 Unauthorized Error
      rest.post(routes.signupPath(), (_req, res, ctx) => {
        return res(ctx.status(409));
      })
    );

    render(<Signup />);

    const usernameInput = screen.getByLabelText('signup.username');
    const passwordInput = screen.getByLabelText('signup.password');
    const confirmPasswordInput = screen.getByLabelText('signup.confirm');
    const submitButton = screen.getByRole('button', { name: 'signup.submit' });

    await user.type(usernameInput, 'correctUsername');
    await user.type(passwordInput, 'correctPassword');
    await user.type(confirmPasswordInput, 'correctPassword');
    await user.click(submitButton);

    const errorTooltip = await screen.findByText('signup.alreadyExists');
    expect(errorTooltip).toBeInTheDocument();

    screen.debug();
  });
});
