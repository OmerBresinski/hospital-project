import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, type RenderHookOptions } from '@testing-library/react';

/**
 * Creates a fresh QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component for testing hooks that use React Query
 */
export function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient || createTestQueryClient();
  
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Renders a hook with React Query provider
 */
export function renderHookWithQuery<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const { queryClient: providedClient, ...renderOptions } = options || {};
  const queryClient = providedClient || createTestQueryClient();
  const wrapper = createQueryWrapper(queryClient);

  return {
    ...renderHook(hook, { wrapper, ...renderOptions }),
    queryClient,
  };
}
