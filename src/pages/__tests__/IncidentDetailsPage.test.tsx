import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { IncidentDetailsPage } from '../IncidentDetailsPage';
import type { IncidentReport } from '@/types';

// Mock incident data
const mockIncident: IncidentReport = {
  id: 'INC-001',
  status: 'open',
  incidentType: 'medical',
  reporterName: 'John Doe',
  reporterRole: 'Nurse',
  reporterDepartment: 'Emergency',
  reportDateTime: '2024-01-15T10:30:00Z',
  incidentClassification: 'abnormal',
  participantClassification: 'hospitalized_patient',
  participantDetails: {
    firstName: 'Jane',
    lastName: 'Smith',
    idNumber: '123456789',
    birthYear: 1990,
    gender: 'female',
    hospitalizedStatus: 'yes',
    hospitalizedDateTime: '2024-01-10T08:00:00Z',
  },
  incidentDateTime: '2024-01-15T09:45:00Z',
  incidentDepartment: 'emergency',
  incidentLocation: 'Room 101',
  incidentDescription: 'Patient fell while getting out of bed.',
  incidentAttendees: [
    { name: 'Dr. Johnson', role: 'employee' },
  ],
  initialDiagnosis: {
    consciousness: 'conscious',
    mobility: 'partially_mobile',
    functionalStatus: 'partially_dependent',
    damage: 'minor_damage',
    incidentResultsDetails: 'Minor bruising on left arm',
  },
  incidentHandling: {
    reportedTo: ['supervisor', 'doctor_on_call'],
    doctorPrognosis: {
      doctorWasCalled: true,
      doctorName: 'Dr. Johnson',
      examinationOccurred: true,
      doctorFindings: 'No fractures detected',
      prognosis: 'Full recovery expected',
      sentToHospital: false,
    },
  },
  contributingIncidents: 'Wet floor from recent cleaning',
  incidentFindings: 'Patient attempted to get out of bed without assistance',
  preventiveMeasures: 'Install bed rails and reminder signs',
  attachments: [],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const mockUseIncident = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/hooks/queries', () => ({
  useIncident: (id: string) => mockUseIncident(id),
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
        'incidents.incidentDetails': 'Incident Details',
        'incidents.columns.id': 'Report #',
        'common.back': 'Back',
        'common.error': 'An error occurred',
        'common.yes': 'Yes',
        'common.no': 'No',
        'form.details.title': 'Details',
        'form.details.reporterName': 'Reporter Name',
        'form.details.reporterRole': 'Reporter Role',
        'form.details.reporterDepartment': 'Reporter Department',
        'form.details.reportDateTime': 'Report Date & Time',
        'form.classification.title': 'Incident Classification',
        'form.classification.abnormal': 'Abnormal Incident',
        'form.status.title': 'Report Status',
        'form.status.open': 'Open',
        'form.incidentType.title': 'Incident Type',
        'form.incidentType.medical': 'Medical',
        'form.participant.title': 'Participant Classification',
        'form.participant.hospitalizedPatient': 'Hospitalized Patient',
        'form.participantDetails.title': 'Participant Details',
        'form.participantDetails.firstName': 'First Name',
        'form.participantDetails.lastName': 'Last Name',
        'form.participantDetails.idNumber': 'ID Number',
        'form.participantDetails.birthYear': 'Birth Year',
        'form.participantDetails.gender': 'Gender',
        'form.participantDetails.female': 'Female',
        'form.participantDetails.hospitalizedStatus': 'Hospitalized',
        'form.incidentDetails.title': 'Incident Details',
        'form.incidentDetails.dateTime': 'Incident Date & Time',
        'form.incidentDetails.department': 'Department',
        'form.incidentDetails.location': 'Location',
        'form.incidentDetails.description': 'Description',
        'form.incidentDetails.attendees': 'Attendees',
        'form.departments.emergency': 'Emergency',
        'form.initialDiagnosis.title': 'Initial Patient Diagnosis',
        'form.initialDiagnosis.consciousness': 'Consciousness',
        'form.initialDiagnosis.conscious': 'Conscious',
        'form.initialDiagnosis.mobility': 'Mobility',
        'form.initialDiagnosis.partiallyMobile': 'Partially Mobile',
        'form.initialDiagnosis.functionalStatus': 'Functional Status',
        'form.initialDiagnosis.partiallyDependent': 'Partially Dependent',
        'form.initialDiagnosis.damage': 'Damage',
        'form.initialDiagnosis.minorDamage': 'Minor Damage',
        'form.initialDiagnosis.incidentResults': 'Incident Results Details',
        'form.handling.title': 'Incident Handling',
        'form.handling.reportedTo': 'Reported To',
        'form.handling.supervisor': 'Supervisor',
        'form.handling.doctorOnCall': 'Doctor on Call',
        'form.doctorPrognosis.title': 'Doctor Prognosis',
        'form.doctorPrognosis.doctorWasCalled': 'Doctor was called',
        'form.doctorPrognosis.doctorName': "Doctor's Name",
        'form.doctorPrognosis.examinationOccurred': 'Examination occurred',
        'form.doctorPrognosis.doctorFindings': "Doctor's Findings",
        'form.doctorPrognosis.prognosis': 'Doctor Prognosis',
        'form.doctorPrognosis.sentToHospital': 'Sent to Hospital',
        'form.conclusion.title': 'Incident Conclusion and Findings',
        'form.conclusion.contributingIncidents': 'Incidents that contributed',
        'form.conclusion.incidentFindings': 'Incident Findings',
        'form.conclusion.preventiveMeasures': 'Preventive Measures',
        'form.attachments.title': 'Attachments',
        'form.attachments.noFiles': 'No files uploaded',
      };
      return translations[key] || key;
    },
  }),
}));

// Helper to render with providers
function renderPage(initialRoute = '/incidents/INC-001') {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
            <Route path="/incidents" element={<div>Incidents List</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('IncidentDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseIncident.mockReturnValue({
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
    mockUseIncident.mockReturnValue({
      data: undefined,
      isPending: false,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
    });

    renderPage();

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should render incident details', () => {
    mockUseIncident.mockReturnValue({
      data: mockIncident,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Header - check for heading level 1
    expect(screen.getByRole('heading', { level: 1, name: 'Incident Details' })).toBeInTheDocument();
    expect(screen.getByText(/INC-001/)).toBeInTheDocument();

    // Details section
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Nurse')).toBeInTheDocument();

    // Participant section
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();

    // Incident details section
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText(/Patient fell while getting out of bed/)).toBeInTheDocument();

    // Conclusion section
    expect(screen.getByText(/Patient attempted to get out of bed without assistance/)).toBeInTheDocument();
  });

  it('should navigate back on button click', async () => {
    const user = userEvent.setup();
    
    mockUseIncident.mockReturnValue({
      data: mockIncident,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    // Find back button
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/incidents');
  });

  it('should call useIncident with correct ID', () => {
    mockUseIncident.mockReturnValue({
      data: mockIncident,
      isPending: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage('/incidents/INC-123');

    expect(mockUseIncident).toHaveBeenCalledWith('INC-123');
  });
});
