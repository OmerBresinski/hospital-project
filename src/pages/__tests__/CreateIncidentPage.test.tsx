import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { CreateIncidentPage } from '../CreateIncidentPage';

const mockNavigate = vi.fn();
const mockCreateIncident = vi.fn();
const mockUser = {
  id: '1',
  username: 'testuser',
  name: 'Test User',
  role: 'Nurse',
  department: 'Emergency',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/contexts', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('@/hooks/mutations', () => ({
  useCreateIncident: () => ({
    mutateAsync: mockCreateIncident,
    isPending: false,
  }),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'incidents.createIncident': 'Create Incident Report',
        'common.back': 'Back',
        'common.cancel': 'Cancel',
        'common.submit': 'Submit',
        'common.save': 'Saved',
        'common.error': 'An error occurred',
        'common.select': 'Select...',
        'common.yes': 'Yes',
        'common.no': 'No',
        'form.status.title': 'Report Status',
        'form.status.open': 'Open',
        'form.status.waitingForApproval': 'Waiting for Approval',
        'form.status.closed': 'Closed',
        'form.incidentType.title': 'Incident Type',
        'form.incidentType.placeholder': 'Select incident type',
        'form.incidentType.medical': 'Medical',
        'form.incidentType.safety': 'Safety',
        'form.incidentType.security': 'Security',
        'form.incidentType.equipment': 'Equipment',
        'form.incidentType.other': 'Other',
        'form.details.title': 'Details',
        'form.details.reporterName': 'Reporter Name',
        'form.details.reporterRole': 'Reporter Role',
        'form.details.reporterDepartment': 'Reporter Department',
        'form.details.reportDateTime': 'Report Date & Time',
        'form.classification.title': 'Incident Classification',
        'form.classification.abnormal': 'Abnormal Incident',
        'form.classification.almost': 'Almost an Incident',
        'form.participant.title': 'Participant Classification',
        'form.participant.visitor': 'Visitor',
        'form.participant.ambulatoryPatient': 'Ambulatory Patient',
        'form.participant.hospitalizedPatient': 'Hospitalized Patient',
        'form.participant.erPatient': 'ER Patient',
        'form.participant.employee': 'Employee',
        'form.participant.noParticipant': 'No Participant',
        'form.participant.other': 'Other',
        'form.incidentDetails.title': 'Incident Details',
        'form.incidentDetails.dateTime': 'Incident Date & Time',
        'form.incidentDetails.department': 'Department',
        'form.incidentDetails.location': 'Location',
        'form.incidentDetails.locationPlaceholder': 'Enter incident location',
        'form.incidentDetails.description': 'Description',
        'form.incidentDetails.descriptionPlaceholder': 'Describe the incident...',
        'form.departments.emergency': 'Emergency',
        'form.departments.general': 'General',
        'form.departments.pediatrics': 'Pediatrics',
        'form.departments.surgery': 'Surgery',
        'form.departments.ambulatory': 'Ambulatory',
        'form.departments.other': 'Other',
        'form.handling.title': 'Incident Handling',
        'form.handling.reportedTo': 'Reported To',
        'form.handling.supervisor': 'Supervisor',
        'form.doctorPrognosis.title': 'Doctor Prognosis',
        'form.doctorPrognosis.doctorWasCalled': 'Doctor was called',
        'form.conclusion.title': 'Incident Conclusion and Findings',
        'form.conclusion.contributingIncidents': 'Contributing Incidents',
        'form.conclusion.incidentFindings': 'Incident Findings',
        'form.conclusion.preventiveMeasures': 'Preventive Measures',
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
          <CreateIncidentPage />
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('CreateIncidentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form with title', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Create Incident Report' })).toBeInTheDocument();
  });

  it('should pre-fill reporter information from user', () => {
    renderPage();

    // Check that reporter fields are pre-filled
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nurse')).toBeInTheDocument();
    // Reporter department field has "Emergency" as value
    const departmentInputs = screen.getAllByDisplayValue('Emergency');
    expect(departmentInputs.length).toBeGreaterThanOrEqual(1);
  });

  it('should render all form sections', () => {
    renderPage();

    // Check that main section headings are present
    // Using getAllByText since some labels appear twice (in CardTitle and as form labels)
    expect(screen.getAllByText('Report Status').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getAllByText('Incident Classification').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Participant Classification').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Incident Details')).toBeInTheDocument();
    expect(screen.getByText('Incident Handling')).toBeInTheDocument();
    expect(screen.getByText('Incident Conclusion and Findings')).toBeInTheDocument();
  });

  it('should have submit and cancel buttons', () => {
    renderPage();

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should navigate back on cancel', async () => {
    const user = userEvent.setup();
    renderPage();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/incidents');
  });

  it('should navigate back on back button click', async () => {
    const user = userEvent.setup();
    renderPage();

    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/incidents');
  });

  it('should have radio buttons for status selection', () => {
    renderPage();

    expect(screen.getByRole('radio', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Waiting for Approval' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Closed' })).toBeInTheDocument();
  });

  it('should have radio buttons for incident classification', () => {
    renderPage();

    expect(screen.getByRole('radio', { name: 'Abnormal Incident' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Almost an Incident' })).toBeInTheDocument();
  });
});
