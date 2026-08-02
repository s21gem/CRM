import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { HelmetProvider } from 'react-helmet-async';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Due to the complexity of App (BrowserRouter, Providers, etc.)
    // We are just performing a smoke test here to ensure Vitest is configured correctly.
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
