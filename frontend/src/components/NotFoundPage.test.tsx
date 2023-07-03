import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NotFound from './NotFoundPage';

describe('NotFound', () => {
  it('should render content', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

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
  });
});
