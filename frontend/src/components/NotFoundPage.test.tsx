import { render, screen } from '@testing-library/react';

import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the not found page with correct content', () => {
    render(<NotFoundPage />);

    const imageElement = screen.getByAltText('notFound.header');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toContain('notFoundImage.svg');

    const headerElement = screen.getByRole('heading', { level: 1 });
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent('notFound.header');

    const messageElement = screen.getByText('notFound.message');
    expect(messageElement).toBeInTheDocument();

    const linkElement = screen.getByRole('link', { name: 'notFound.linkText' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toContain('/');
  });
});
