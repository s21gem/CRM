import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Due to the complexity of App (BrowserRouter, Providers, etc.)
    // We are just performing a smoke test here to ensure Vitest is configured correctly.
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
