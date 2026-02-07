import { useQuery, queryOptions } from '@tanstack/react-query';
import { settingsApi } from '@/services/api';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  current: () => [...settingsKeys.all, 'current'] as const,
};

// Query options
export const settingsQueryOptions = queryOptions({
  queryKey: settingsKeys.current(),
  queryFn: settingsApi.get,
  staleTime: Infinity, // Settings rarely change, keep fresh
});

/**
 * Hook to get current settings
 */
export function useSettings() {
  return useQuery(settingsQueryOptions);
}
