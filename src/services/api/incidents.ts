import type { IncidentReport, IncidentReportInput, IncidentListItem } from '@/types';
import { seedIncidentsIfEmpty } from '@/services/seedData';

const STORAGE_KEY = 'incidents';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get incidents from localStorage
const getStoredIncidents = (): IncidentReport[] => {
  // Seed data if empty (only runs once)
  seedIncidentsIfEmpty();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save incidents to localStorage
const saveIncidents = (incidents: IncidentReport[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
};

export const incidentApi = {
  /**
   * Get all incidents
   * Future: Replace with fetch('/api/incidents')
   */
  getAll: async (): Promise<IncidentReport[]> => {
    await delay(300);
    return getStoredIncidents();
  },

  /**
   * Get incidents for list view (minimal data)
   * Future: Replace with fetch('/api/incidents?fields=id,type,dateTime,reporter,department,status')
   */
  getList: async (): Promise<IncidentListItem[]> => {
    await delay(300);
    const incidents = getStoredIncidents();
    
    return incidents.map((incident) => ({
      id: incident.id,
      incidentType: incident.incidentType,
      reportDateTime: incident.reportDateTime,
      reporterName: incident.reporterName,
      incidentDepartment: incident.incidentDepartment,
      status: incident.status,
    }));
  },

  /**
   * Get a single incident by ID
   * Future: Replace with fetch(`/api/incidents/${id}`)
   */
  getById: async (id: string): Promise<IncidentReport | null> => {
    await delay(200);
    const incidents = getStoredIncidents();
    return incidents.find((i) => i.id === id) || null;
  },

  /**
   * Create a new incident
   * Future: Replace with fetch('/api/incidents', { method: 'POST', body: JSON.stringify(incident) })
   */
  create: async (input: IncidentReportInput): Promise<IncidentReport> => {
    await delay(400);
    
    const incidents = getStoredIncidents();
    const now = new Date().toISOString();
    
    const newIncident: IncidentReport = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    incidents.unshift(newIncident); // Add to beginning
    saveIncidents(incidents);

    return newIncident;
  },

  /**
   * Update an existing incident
   * Future: Replace with fetch(`/api/incidents/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
   */
  update: async (
    id: string,
    updates: Partial<IncidentReportInput>
  ): Promise<IncidentReport> => {
    await delay(400);
    
    const incidents = getStoredIncidents();
    const index = incidents.findIndex((i) => i.id === id);

    if (index === -1) {
      throw new Error(`Incident with ID ${id} not found`);
    }

    const updatedIncident: IncidentReport = {
      ...incidents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    incidents[index] = updatedIncident;
    saveIncidents(incidents);

    return updatedIncident;
  },

  /**
   * Delete an incident
   * Future: Replace with fetch(`/api/incidents/${id}`, { method: 'DELETE' })
   */
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const incidents = getStoredIncidents();
    const filtered = incidents.filter((i) => i.id !== id);

    if (filtered.length === incidents.length) {
      throw new Error(`Incident with ID ${id} not found`);
    }

    saveIncidents(filtered);
  },

  /**
   * Get dashboard statistics
   * Future: Replace with fetch('/api/incidents/stats')
   */
  getStats: async () => {
    await delay(300);
    const incidents = getStoredIncidents();

    // Incidents by status
    const byStatus = incidents.reduce(
      (acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Incidents by type
    const byType = incidents.reduce(
      (acc, incident) => {
        acc[incident.incidentType] = (acc[incident.incidentType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Incidents by department
    const byDepartment = incidents.reduce(
      (acc, incident) => {
        acc[incident.incidentDepartment] = (acc[incident.incidentDepartment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Incidents by month (last 12 months)
    const byMonth = incidents.reduce(
      (acc, incident) => {
        const date = new Date(incident.reportDateTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Incidents by reporter
    const byReporter = incidents.reduce(
      (acc, incident) => {
        acc[incident.reporterName] = (acc[incident.reporterName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Incidents by doctor called
    const byDoctorCalled = incidents.reduce(
      (acc, incident) => {
        const called = incident.incidentHandling?.doctorPrognosis?.doctorWasCalled
          ? 'yes'
          : 'no';
        acc[called] = (acc[called] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: incidents.length,
      byStatus,
      byType,
      byDepartment,
      byMonth,
      byReporter,
      byDoctorCalled,
    };
  },
};
