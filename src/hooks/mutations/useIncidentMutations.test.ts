import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithQuery } from '@/test/test-utils';
import {
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
} from './useIncidentMutations';
import { incidentApi } from '@/services/api';
import { incidentKeys } from '@/hooks/queries';
import type { IncidentReport, IncidentReportInput } from '@/types';

// Mock only incidentApi from the services
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>();
  return {
    ...actual,
    incidentApi: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn(),
      getList: vi.fn(),
      getById: vi.fn(),
      getStats: vi.fn(),
    },
  };
});

// Helper to create mock incident input
const createMockIncidentInput = (
  overrides?: Partial<IncidentReportInput>
): IncidentReportInput => ({
  status: 'open',
  incidentType: 'medical',
  reporterName: 'Sarah Cohen',
  reporterRole: 'Nurse',
  reporterDepartment: 'Emergency',
  reportDateTime: new Date().toISOString(),
  incidentClassification: 'abnormal',
  participantClassification: 'hospitalized_patient',
  incidentDateTime: new Date().toISOString(),
  incidentDepartment: 'emergency',
  incidentLocation: 'Room 101',
  incidentDescription: 'Test incident description',
  incidentFindings: 'Test findings',
  ...overrides,
});

describe('useIncidentMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCreateIncident', () => {
    it('should call incidentApi.create with input', async () => {
      const mockIncident: IncidentReport = {
        ...createMockIncidentInput(),
        id: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      vi.mocked(incidentApi.create).mockResolvedValueOnce(mockIncident);

      const { result } = renderHookWithQuery(() => useCreateIncident());
      const input = createMockIncidentInput();

      await result.current.mutateAsync(input);

      expect(incidentApi.create).toHaveBeenCalledWith(input);
    });

    it('should invalidate incident queries on success', async () => {
      const mockIncident: IncidentReport = {
        ...createMockIncidentInput(),
        id: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      vi.mocked(incidentApi.create).mockResolvedValueOnce(mockIncident);

      const { result, queryClient } = renderHookWithQuery(() =>
        useCreateIncident()
      );
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await result.current.mutateAsync(createMockIncidentInput());

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: incidentKeys.all,
      });
    });
  });

  describe('useUpdateIncident', () => {
    it('should call incidentApi.update with id and updates', async () => {
      const mockUpdated: IncidentReport = {
        ...createMockIncidentInput({ status: 'closed' }),
        id: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      vi.mocked(incidentApi.update).mockResolvedValueOnce(mockUpdated);

      const { result } = renderHookWithQuery(() => useUpdateIncident());

      await result.current.mutateAsync({
        id: 'test-id',
        updates: { status: 'closed' },
      });

      expect(incidentApi.update).toHaveBeenCalledWith('test-id', {
        status: 'closed',
      });
    });

    it('should update cache with updated incident on success', async () => {
      const mockUpdated: IncidentReport = {
        ...createMockIncidentInput({ status: 'closed' }),
        id: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      vi.mocked(incidentApi.update).mockResolvedValueOnce(mockUpdated);

      const { result, queryClient } = renderHookWithQuery(() =>
        useUpdateIncident()
      );

      await result.current.mutateAsync({
        id: 'test-id',
        updates: { status: 'closed' },
      });

      const cached = queryClient.getQueryData(incidentKeys.detail('test-id'));
      expect(cached).toEqual(mockUpdated);
    });
  });

  describe('useDeleteIncident', () => {
    it('should call incidentApi.delete with id', async () => {
      vi.mocked(incidentApi.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHookWithQuery(() => useDeleteIncident());

      await result.current.mutateAsync('test-id');

      expect(incidentApi.delete).toHaveBeenCalledWith('test-id');
    });

    it('should remove incident from cache on success', async () => {
      vi.mocked(incidentApi.delete).mockResolvedValueOnce(undefined);

      const { result, queryClient } = renderHookWithQuery(() =>
        useDeleteIncident()
      );

      // Pre-populate cache
      queryClient.setQueryData(incidentKeys.detail('test-id'), {
        id: 'test-id',
      });

      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      await result.current.mutateAsync('test-id');

      expect(removeSpy).toHaveBeenCalledWith({
        queryKey: incidentKeys.detail('test-id'),
      });
    });
  });
});
