import { useQuery, queryOptions } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import type { User } from '@/types';

// Query keys factory
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Query options factory (v5 pattern for reusability)
export const currentUserQueryOptions = queryOptions({
  queryKey: authKeys.user(),
  queryFn: authApi.getCurrentUser,
  staleTime: 1000 * 60 * 10, // 10 minutes
});

/**
 * Hook to get the current authenticated user
 */
export function useCurrentUser() {
  return useQuery(currentUserQueryOptions);
}

/**
 * Hook to check if user is authenticated
 * Returns a derived boolean from the user query
 */
export function useIsAuthenticated() {
  const { data: user, isPending } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isPending,
    user: user as User | null,
  };
}
