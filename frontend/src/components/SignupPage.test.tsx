import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import SignupPage from './SignupPage';

vi.mock('@rollbar/react');

describe('SignupPage', () => {
  it('renders signup form with input fields', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
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
