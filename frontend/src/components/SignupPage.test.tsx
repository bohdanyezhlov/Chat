import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { store } from '../init';
import SignupPage from './SignupPage';

describe('SignupPage', () => {
  it('renders signup form with input fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
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
});
