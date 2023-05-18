import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { store } from '../init';
import LoginPage from './LoginPage';

vi.mock('axios');

describe('LoginPage component', () => {
  it('renders login form with input fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByLabelText('login.username');
    const passwordInput = screen.getByLabelText('login.password');
    const submitButton = screen.getByRole('button', { name: 'login.submit' });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
