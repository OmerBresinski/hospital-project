import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import { authKeys } from '@/hooks/queries';
import type { LoginCredentials } from '@/types';

/**
 * Hook to login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear the current user cache
      queryClient.setQueryData(authKeys.user(), null);
      // Invalidate all queries to clear sensitive data
      queryClient.clear();
    },
  });
}
