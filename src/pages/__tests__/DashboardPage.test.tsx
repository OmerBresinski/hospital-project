import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { DashboardPage } from '../DashboardPage';

// Mock stats data
const mockStats = {
  total: 10,
  byStatus: {
    open: 4,
    closed: 5,
    waiting_for_approval: 1,
  },
  byType: {
    medical: 5,
    safety: 3,
    equipment: 2,
  },
  byDepartment: {
    emergency: 4,
    general: 3,
    surgery: 3,
  },
  byMonth: {
    '2024-01': 3,
    '2024-02': 4,
    '2024-03': 3,
  },
  byReporter: {
    'John Doe': 5,
    'Jane Smith': 3,
    'Bob Johnson': 2,
  },
  byDoctorCalled: {
    yes: 6,
    no: 4,
  },
};

const mockUseIncidentStats = vi.fn();

vi.mock('@/hooks/queries', () => ({
  useIncidentStats: () => mockUseIncidentStats(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.title': 'Analytics',
        'dashboard.totalIncidents': 'Total Incidents',
        'dashboard.openIncidents': 'Open Incidents',
        'dashboard.closedIncidents': 'Closed Incidents',
        'dashboard.incidentsByType': 'Incidents by Type',
        'dashboard.incidentsByStatus': 'Incidents by Status',
        'dashboard.incidentsByMonth': 'Incidents by Month',
        'dashboard.incidentsByReporter': 'Incidents by Reporter',
        'dashboard.incidentsByDepartment': 'Incidents by Department',
        'common.error': 'An error occurred',
        'common.noResults': 'No results found',
        'form.incidentType.medical': 'Medical',
        'form.incidentType.safety': 'Safety',
        'form.incidentType.equipment': 'Equipment',
        'form.status.open': 'Open',
        'form.status.closed': 'Closed',
        'form.status.waitingForApproval': 'Waiting for Approval',
        'form.departments.emergency': 'Emergency',
        'form.departments.general': 'General',
        'form.departments.surgery': 'Surgery',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Recharts - just render divs instead of actual charts
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Bar: () => <div data-testid="bar" />,
    Line: () => <div data-testid="line" />,
    Pie: () => <div data-testid="pie" />,
    XAxis: () => null,
    YAxis: () => null,
    Cell: () => null,
    CartesianGrid: () => null,
  };
});

// Helper to render with providers
function renderPage() {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseIncidentStats.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseIncidentStats.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Failed to fetch'),
    });

    renderPage();

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should render dashboard title', () => {
    mockUseIncidentStats.mockReturnValue({
      data: mockStats,
      isPending: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should render stat cards with correct values', () => {
    mockUseIncidentStats.mockReturnValue({
      data: mockStats,
      isPending: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Check stat card titles are present
    expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    expect(screen.getByText('Open Incidents')).toBeInTheDocument();
    expect(screen.getByText('Closed Incidents')).toBeInTheDocument();

    // Total incidents value
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render all chart sections', () => {
    mockUseIncidentStats.mockReturnValue({
      data: mockStats,
      isPending: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Check chart titles
    expect(screen.getByText('Incidents by Type')).toBeInTheDocument();
    expect(screen.getByText('Incidents by Status')).toBeInTheDocument();
    expect(screen.getByText('Incidents by Department')).toBeInTheDocument();
    expect(screen.getByText('Incidents by Month')).toBeInTheDocument();
    expect(screen.getByText('Incidents by Reporter')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    mockUseIncidentStats.mockReturnValue({
      data: {
        total: 0,
        byStatus: {},
        byType: {},
        byDepartment: {},
        byMonth: {},
        byReporter: {},
        byDoctorCalled: {},
      },
      isPending: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Should show "no results" in chart areas
    const noResults = screen.getAllByText('No results found');
    expect(noResults.length).toBeGreaterThan(0);
  });
});
