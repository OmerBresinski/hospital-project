import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentApi } from '@/services/api';
import { incidentKeys } from '@/hooks/queries';
import type { IncidentReportInput } from '@/types';

/**
 * Hook to create a new incident
 */
export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IncidentReportInput) => incidentApi.create(input),
    onSuccess: () => {
      // Invalidate all incident queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: incidentKeys.all });
    },
  });
}

/**
 * Hook to update an existing incident
 */
export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<IncidentReportInput>;
    }) => incidentApi.update(id, updates),
    onSuccess: (updatedIncident) => {
      // Update the specific incident in cache
      queryClient.setQueryData(
        incidentKeys.detail(updatedIncident.id),
        updatedIncident
      );
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: incidentKeys.stats() });
    },
  });
}

/**
 * Hook to delete an incident
 */
export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incidentApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: incidentKeys.detail(deletedId) });
      // Invalidate list and stats
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.stats() });
    },
  });
}
