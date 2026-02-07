import { describe, it, expect, beforeEach, vi } from 'vitest';
import { incidentApi } from './incidents';
import type { IncidentReportInput } from '@/types';

// Helper to create a valid incident input
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

describe('incidentApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return empty array when no incidents exist', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);
      
      const incidents = await incidentApi.getAll();
      expect(incidents).toEqual([]);
    });

    it('should return all stored incidents', async () => {
      const mockIncidents = [
        { id: '1', incidentType: 'medical' },
        { id: '2', incidentType: 'safety' },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      const incidents = await incidentApi.getAll();
      expect(incidents).toHaveLength(2);
    });
  });

  describe('getList', () => {
    it('should return incidents with only list fields', async () => {
      const mockIncidents = [
        {
          id: '1',
          incidentType: 'medical',
          reportDateTime: '2024-01-01T00:00:00.000Z',
          reporterName: 'Sarah Cohen',
          incidentDepartment: 'emergency',
          status: 'open',
          incidentDescription: 'This should not be included',
        },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      const list = await incidentApi.getList();
      
      expect(list).toHaveLength(1);
      expect(list[0]).toEqual({
        id: '1',
        incidentType: 'medical',
        reportDateTime: '2024-01-01T00:00:00.000Z',
        reporterName: 'Sarah Cohen',
        incidentDepartment: 'emergency',
        status: 'open',
      });
      expect(list[0]).not.toHaveProperty('incidentDescription');
    });
  });

  describe('getById', () => {
    it('should return null for non-existent incident', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      const incident = await incidentApi.getById('non-existent');
      expect(incident).toBeNull();
    });

    it('should return incident by ID', async () => {
      const mockIncidents = [
        { id: '1', incidentType: 'medical' },
        { id: '2', incidentType: 'safety' },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      const incident = await incidentApi.getById('2');
      expect(incident).toEqual({ id: '2', incidentType: 'safety' });
    });
  });

  describe('create', () => {
    it('should create a new incident with generated ID', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      const input = createMockIncidentInput();
      const created = await incidentApi.create(input);

      expect(created.id).toBeDefined();
      expect(created.id).toContain('test-uuid');
      expect(created.incidentType).toBe('medical');
      expect(created.createdAt).toBeDefined();
      expect(created.updatedAt).toBeDefined();
    });

    it('should store the new incident in localStorage', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      const input = createMockIncidentInput();
      await incidentApi.create(input);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'incidents',
        expect.any(String)
      );
    });

    it('should prepend new incident to existing list', async () => {
      const existingIncidents = [{ id: 'existing', incidentType: 'safety' }];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(existingIncidents)
      );

      const input = createMockIncidentInput();
      await incidentApi.create(input);

      const setItemCall = vi.mocked(localStorage.setItem).mock.calls.find(
        (call) => call[0] === 'incidents'
      );
      const storedIncidents = JSON.parse(setItemCall![1]);
      
      expect(storedIncidents).toHaveLength(2);
      expect(storedIncidents[0].incidentType).toBe('medical'); // New one first
      expect(storedIncidents[1].id).toBe('existing');
    });
  });

  describe('update', () => {
    it('should throw error for non-existent incident', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      await expect(
        incidentApi.update('non-existent', { status: 'closed' })
      ).rejects.toThrow('Incident with ID non-existent not found');
    });

    it('should update existing incident', async () => {
      const mockIncidents = [
        {
          id: '1',
          status: 'open',
          incidentType: 'medical',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      const updated = await incidentApi.update('1', { status: 'closed' });

      expect(updated.status).toBe('closed');
      expect(updated.incidentType).toBe('medical');
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date('2024-01-01T00:00:00.000Z').getTime()
      );
    });
  });

  describe('delete', () => {
    it('should throw error for non-existent incident', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      await expect(incidentApi.delete('non-existent')).rejects.toThrow(
        'Incident with ID non-existent not found'
      );
    });

    it('should remove incident from storage', async () => {
      const mockIncidents = [
        { id: '1', incidentType: 'medical' },
        { id: '2', incidentType: 'safety' },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      await incidentApi.delete('1');

      const setItemCall = vi.mocked(localStorage.setItem).mock.calls.find(
        (call) => call[0] === 'incidents'
      );
      const storedIncidents = JSON.parse(setItemCall![1]);

      expect(storedIncidents).toHaveLength(1);
      expect(storedIncidents[0].id).toBe('2');
    });
  });

  describe('getStats', () => {
    it('should return zeroes for empty incidents', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify([]));

      const stats = await incidentApi.getStats();

      expect(stats.total).toBe(0);
      expect(stats.byStatus).toEqual({});
      expect(stats.byType).toEqual({});
    });

    it('should calculate correct statistics', async () => {
      const mockIncidents = [
        {
          id: '1',
          status: 'open',
          incidentType: 'medical',
          incidentDepartment: 'emergency',
          reportDateTime: '2024-01-15T00:00:00.000Z',
          reporterName: 'Sarah Cohen',
          incidentHandling: { doctorPrognosis: { doctorWasCalled: true } },
        },
        {
          id: '2',
          status: 'open',
          incidentType: 'medical',
          incidentDepartment: 'general',
          reportDateTime: '2024-01-20T00:00:00.000Z',
          reporterName: 'David Levi',
          incidentHandling: { doctorPrognosis: { doctorWasCalled: false } },
        },
        {
          id: '3',
          status: 'closed',
          incidentType: 'safety',
          incidentDepartment: 'emergency',
          reportDateTime: '2024-02-01T00:00:00.000Z',
          reporterName: 'Sarah Cohen',
        },
      ];
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(mockIncidents)
      );

      const stats = await incidentApi.getStats();

      expect(stats.total).toBe(3);
      expect(stats.byStatus).toEqual({ open: 2, closed: 1 });
      expect(stats.byType).toEqual({ medical: 2, safety: 1 });
      expect(stats.byDepartment).toEqual({ emergency: 2, general: 1 });
      expect(stats.byReporter).toEqual({ 'Sarah Cohen': 2, 'David Levi': 1 });
      expect(stats.byDoctorCalled).toEqual({ yes: 1, no: 2 });
    });
  });
});
