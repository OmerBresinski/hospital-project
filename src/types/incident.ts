// Report Status
export type ReportStatus = 'open' | 'waiting_for_approval' | 'closed';

// Incident Classification
export type IncidentClassification = 'abnormal' | 'almost';

// Participant Classification
export type ParticipantClassification =
  | 'visitor'
  | 'ambulatory_patient'
  | 'hospitalized_patient'
  | 'er_patient'
  | 'employee'
  | 'no_participant'
  | 'other';

// Department
export type Department =
  | 'emergency'
  | 'general'
  | 'pediatrics'
  | 'surgery'
  | 'ambulatory'
  | 'other';

// Attendee Role
export type AttendeeRole =
  | 'visitor'
  | 'ambulatory_patient'
  | 'hospitalized_patient'
  | 'er_patient'
  | 'employee'
  | 'other';

// Consciousness Level
export type ConsciousnessLevel = 'conscious' | 'unconscious' | 'no_consciousness';

// Mobility Level
export type MobilityLevel = 'mobile' | 'partially_mobile' | 'no_mobility';

// Functional Status
export type FunctionalStatus = 'independent' | 'partially_dependent' | 'dependent' | 'bedridden';

// Damage Level
export type DamageLevel = 'no_damage' | 'minor_damage' | 'major_damage' | 'unknown';

// Reported To Options
export type ReportedTo =
  | 'supervisor'
  | 'general_supervisor'
  | 'shift_manager'
  | 'epidemiologist_nurse'
  | 'maintenance'
  | 'it'
  | 'guardian'
  | 'security'
  | 'police'
  | 'bio_engineer'
  | 'hospital_management'
  | 'nursing_administration'
  | 'administrative_manager'
  | 'department_manager'
  | 'healthcare_facilities_supervisor'
  | 'family'
  | 'doctor_on_call'
  | 'active_doctor'
  | 'clinical_pharmacist'
  | 'other';

// Gender
export type Gender = 'male' | 'female' | 'other';

// Hospitalized Status
export type HospitalizedStatus = 'yes' | 'no';

// Attendee
export interface Attendee {
  name: string;
  role: AttendeeRole;
}

// Participant Details
export interface ParticipantDetails {
  firstName: string;
  lastName: string;
  idNumber: string;
  birthYear: number;
  gender: Gender;
  hospitalizedStatus: HospitalizedStatus;
  hospitalizedDateTime?: string;
}

// Initial Diagnosis
export interface InitialDiagnosis {
  consciousness: ConsciousnessLevel;
  mobility: MobilityLevel;
  functionalStatus: FunctionalStatus;
  damage: DamageLevel;
  incidentResultsDetails?: string;
}

// Doctor Prognosis
export interface DoctorPrognosis {
  doctorWasCalled: boolean;
  doctorName?: string;
  examinationOccurred?: boolean;
  doctorFindings?: string;
  prognosis?: string;
  sentToHospital?: boolean;
  sentParticipantName?: string;
  hospitalName?: string;
}

// Incident Handling
export interface IncidentHandling {
  reportedTo: ReportedTo[];
  doctorPrognosis?: DoctorPrognosis;
}

// Attachment
export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  // In a real app, this would be a URL or blob
  dataUrl?: string;
}

// Full Incident Report
export interface IncidentReport {
  id: string;
  
  // Status
  status: ReportStatus;
  incidentType: string;
  
  // Details (Section 2.1)
  reporterName: string;
  reporterRole: string;
  reporterDepartment: string;
  reportDateTime: string;
  
  // Incident Classification (Section 2.2)
  incidentClassification: IncidentClassification;
  
  // Participant Classification (Section 2.3)
  participantClassification: ParticipantClassification;
  
  // Participant Details (Section 2.4)
  participantDetails?: ParticipantDetails;
  
  // Incident Details (Section 2.5)
  incidentDateTime: string;
  incidentDepartment: Department;
  incidentLocation: string;
  incidentDescription: string;
  incidentAttendees?: Attendee[];
  
  // Initial Diagnosis (Section 2.6)
  initialDiagnosis?: InitialDiagnosis;
  
  // Incident Handling (Section 2.7)
  incidentHandling?: IncidentHandling;
  
  // Conclusion and Findings (Section 2.8)
  contributingIncidents?: string;
  incidentFindings: string;
  preventiveMeasures?: string;
  
  // Attachments (Section 2.9)
  attachments?: Attachment[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Form input type (without auto-generated fields)
export type IncidentReportInput = Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt'>;

// For the list view
export interface IncidentListItem {
  id: string;
  incidentType: string;
  reportDateTime: string;
  reporterName: string;
  incidentDepartment: Department;
  status: ReportStatus;
}
