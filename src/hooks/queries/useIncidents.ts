import { useQuery, queryOptions } from '@tanstack/react-query';
import { incidentApi } from '@/services/api';

// Query keys factory - organized by feature
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: () => [...incidentKeys.lists()] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
  stats: () => [...incidentKeys.all, 'stats'] as const,
};

// Query options factories (v5 pattern)
export const incidentsListQueryOptions = queryOptions({
  queryKey: incidentKeys.list(),
  queryFn: incidentApi.getList,
});

export const incidentDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: incidentKeys.detail(id),
    queryFn: () => incidentApi.getById(id),
    enabled: !!id, // Only fetch when ID is provided
  });

export const incidentStatsQueryOptions = queryOptions({
  queryKey: incidentKeys.stats(),
  queryFn: incidentApi.getStats,
});

/**
 * Hook to get all incidents (list view)
 */
export function useIncidents() {
  return useQuery(incidentsListQueryOptions);
}

/**
 * Hook to get a single incident by ID
 */
export function useIncident(id: string) {
  return useQuery(incidentDetailQueryOptions(id));
}

/**
 * Hook to get dashboard statistics
 */
export function useIncidentStats() {
  return useQuery(incidentStatsQueryOptions);
}
