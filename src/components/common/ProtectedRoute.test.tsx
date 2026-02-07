import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './ProtectedRoute';
import { createTestQueryClient } from '@/test/test-utils';

// Mock contexts
vi.mock('@/contexts', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LocaleProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocale: () => ({ locale: 'en', direction: 'ltr', setLocale: vi.fn() }),
}));

import { useAuth } from '@/contexts';

// Helper to render with providers
function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ['/protected'] } = {}
) {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={ui}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner while checking auth', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoggingIn: false,
      isLoggingOut: false,
      loginError: null,
    });

    renderWithRouter(<ProtectedRoute />);

    // Check for spinner (it has role="status")
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoggingIn: false,
      isLoggingOut: false,
      loginError: null,
    });

    renderWithRouter(<ProtectedRoute />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'test', name: 'Test User', role: 'Nurse', department: 'Emergency' },
      isAuthenticated: true,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoggingIn: false,
      isLoggingOut: false,
      loginError: null,
    });

    renderWithRouter(<ProtectedRoute />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
