import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHookWithQuery, createTestQueryClient } from '@/test/test-utils';
import { useLogin, useLogout } from './useAuthMutations';
import { authApi } from '@/services/api';
import { authKeys } from '@/hooks/queries';

// Mock only authApi from the services
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>();
  return {
    ...actual,
    authApi: {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      isAuthenticated: vi.fn(),
    },
  };
});

describe('useAuthMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should call authApi.login with credentials', async () => {
      const mockUser = {
        id: '1',
        username: 'nurse1',
        name: 'Sarah Cohen',
        role: 'Nurse',
        department: 'Emergency',
      };
      vi.mocked(authApi.login).mockResolvedValueOnce(mockUser);

      const { result } = renderHookWithQuery(() => useLogin());

      result.current.mutate({ username: 'nurse1', password: 'password' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authApi.login).toHaveBeenCalledWith({
        username: 'nurse1',
        password: 'password',
      });
    });

    it('should update query cache on successful login', async () => {
      const mockUser = {
        id: '1',
        username: 'nurse1',
        name: 'Sarah Cohen',
        role: 'Nurse',
        department: 'Emergency',
      };
      vi.mocked(authApi.login).mockResolvedValueOnce(mockUser);

      const { result, queryClient } = renderHookWithQuery(() => useLogin());

      // Use mutateAsync to wait for the entire mutation including onSuccess
      await result.current.mutateAsync({ username: 'nurse1', password: 'password' });

      // Check that the user was set in cache
      const cachedUser = queryClient.getQueryData(authKeys.user());
      expect(cachedUser).toEqual(mockUser);
    });

    it('should handle login error', async () => {
      vi.mocked(authApi.login).mockRejectedValueOnce(
        new Error('Invalid credentials')
      );

      const { result } = renderHookWithQuery(() => useLogin());

      result.current.mutate({ username: 'invalid', password: 'invalid' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Invalid credentials');
    });
  });

  describe('useLogout', () => {
    it('should call authApi.logout', async () => {
      vi.mocked(authApi.logout).mockResolvedValueOnce(undefined);

      const { result } = renderHookWithQuery(() => useLogout());

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authApi.logout).toHaveBeenCalled();
    });

    it('should clear user from cache on successful logout', async () => {
      vi.mocked(authApi.logout).mockResolvedValueOnce(undefined);

      const queryClient = createTestQueryClient();
      // Pre-populate cache with user
      queryClient.setQueryData(authKeys.user(), {
        id: '1',
        username: 'nurse1',
      });

      const { result } = renderHookWithQuery(() => useLogout(), { queryClient });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const cachedUser = queryClient.getQueryData(authKeys.user());
      expect(cachedUser).toBeUndefined(); // Cache should be cleared
    });
  });
});
