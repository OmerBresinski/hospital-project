import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { IncidentListPage } from '../IncidentListPage';
import type { IncidentListItem } from '@/types';

// Mock useIncidents hook
const mockIncidents: IncidentListItem[] = [
  {
    id: 'INC-001',
    incidentType: 'medical',
    reportDateTime: '2024-01-15T10:30:00Z',
    reporterName: 'John Doe',
    incidentDepartment: 'emergency',
    status: 'open',
  },
  {
    id: 'INC-002',
    incidentType: 'safety',
    reportDateTime: '2024-01-14T14:00:00Z',
    reporterName: 'Jane Smith',
    incidentDepartment: 'general',
    status: 'closed',
  },
];

const mockUseIncidents = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/hooks/queries', () => ({
  useIncidents: () => mockUseIncidents(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'incidents.title': 'Incident Reports',
        'incidents.newIncident': 'New Incident Report',
        'incidents.noIncidents': 'No incidents found',
        'incidents.columns.id': 'Report #',
        'incidents.columns.type': 'Type',
        'incidents.columns.dateTime': 'Date & Time',
        'incidents.columns.reporter': 'Reporter',
        'incidents.columns.department': 'Department',
        'incidents.columns.status': 'Status',
        'common.error': 'An error occurred',
        'form.status.open': 'Open',
        'form.status.closed': 'Closed',
        'form.status.waitingForApproval': 'Waiting for Approval',
        'form.departments.emergency': 'Emergency',
        'form.departments.general': 'General',
        'form.incidentType.medical': 'Medical',
        'form.incidentType.safety': 'Safety',
      };
      return translations[key] || key;
    },
  }),
}));

// Helper to render with providers
function renderPage() {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <IncidentListPage />
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('IncidentListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseIncidents.mockReturnValue({
      data: undefined,
      isPending: true,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseIncidents.mockReturnValue({
      data: undefined,
      isPending: false,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
    });

    renderPage();

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should show empty state when no incidents', () => {
    mockUseIncidents.mockReturnValue({
      data: [],
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('No incidents found')).toBeInTheDocument();
  });

  it('should render incidents table', () => {
    mockUseIncidents.mockReturnValue({
      data: mockIncidents,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Check table headers
    expect(screen.getByText('Report #')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Date & Time')).toBeInTheDocument();
    expect(screen.getByText('Reporter')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check incident data is rendered
    expect(screen.getByText('INC-001')).toBeInTheDocument();
    expect(screen.getByText('INC-002')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should navigate to incident details on row click', async () => {
    const user = userEvent.setup();
    
    mockUseIncidents.mockReturnValue({
      data: mockIncidents,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Find and click the first row
    const firstRow = screen.getByText('INC-001').closest('tr');
    expect(firstRow).toBeInTheDocument();
    
    await user.click(firstRow!);

    expect(mockNavigate).toHaveBeenCalledWith('/incidents/INC-001');
  });

  it('should navigate to create incident page on button click', async () => {
    const user = userEvent.setup();
    
    mockUseIncidents.mockReturnValue({
      data: mockIncidents,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Find the "New Incident Report" button
    const button = screen.getByRole('button', { name: /new incident report/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/incidents/new');
  });

  it('should display status badges', () => {
    mockUseIncidents.mockReturnValue({
      data: mockIncidents,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Check that status badges are rendered
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});
