import { z } from 'zod';

// Re-usable schemas for common types
const reportStatusSchema = z.enum(['open', 'waiting_for_approval', 'closed']);

const incidentClassificationSchema = z.enum(['abnormal', 'almost']);

const participantClassificationSchema = z.enum([
  'visitor',
  'ambulatory_patient',
  'hospitalized_patient',
  'er_patient',
  'employee',
  'no_participant',
  'other',
]);

const departmentSchema = z.enum([
  'emergency',
  'general',
  'pediatrics',
  'surgery',
  'ambulatory',
  'other',
]);

const genderSchema = z.enum(['male', 'female', 'other']);

const hospitalizedStatusSchema = z.enum(['yes', 'no']);

const attendeeRoleSchema = z.enum([
  'visitor',
  'ambulatory_patient',
  'hospitalized_patient',
  'er_patient',
  'employee',
  'other',
]);

const consciousnessSchema = z.enum(['conscious', 'unconscious', 'no_consciousness']);

const mobilitySchema = z.enum(['mobile', 'partially_mobile', 'no_mobility']);

const functionalStatusSchema = z.enum([
  'independent',
  'partially_dependent',
  'dependent',
  'bedridden',
]);

const damageSchema = z.enum(['no_damage', 'minor_damage', 'major_damage', 'unknown']);

const reportedToSchema = z.enum([
  'supervisor',
  'general_supervisor',
  'shift_manager',
  'epidemiologist_nurse',
  'maintenance',
  'it',
  'guardian',
  'security',
  'police',
  'bio_engineer',
  'hospital_management',
  'nursing_administration',
  'administrative_manager',
  'department_manager',
  'healthcare_facilities_supervisor',
  'family',
  'doctor_on_call',
  'active_doctor',
  'clinical_pharmacist',
  'other',
]);

// Participant details schema (Section 2.4)
export const participantDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  birthYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  gender: genderSchema,
  hospitalizedStatus: hospitalizedStatusSchema,
  hospitalizedDateTime: z.string().optional(),
});

// Attendee schema (Section 2.5)
export const attendeeSchema = z.object({
  name: z.string().min(1, 'Attendee name is required'),
  role: attendeeRoleSchema,
});

// Initial diagnosis schema (Section 2.6)
export const initialDiagnosisSchema = z.object({
  consciousness: consciousnessSchema,
  mobility: mobilitySchema,
  functionalStatus: functionalStatusSchema,
  damage: damageSchema,
  incidentResultsDetails: z.string().optional(),
});

// Doctor prognosis schema (Section 2.7)
export const doctorPrognosisSchema = z.object({
  doctorWasCalled: z.boolean(),
  doctorName: z.string().optional(),
  examinationOccurred: z.boolean().optional(),
  doctorFindings: z.string().optional(),
  prognosis: z.string().optional(),
  sentToHospital: z.boolean().optional(),
  sentParticipantName: z.string().optional(),
  hospitalName: z.string().optional(),
});

// Incident handling schema (Section 2.7)
export const incidentHandlingSchema = z.object({
  reportedTo: z.array(reportedToSchema).optional(),
  doctorPrognosis: doctorPrognosisSchema.optional(),
});

// Attachment schema (Section 2.9)
export const attachmentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  uploadedAt: z.string(),
  dataUrl: z.string().optional(),
});

// Main incident report form schema
export const incidentReportFormSchema = z.object({
  // Status (Section 1)
  status: reportStatusSchema,
  incidentType: z.string().min(1, 'Incident type is required'),

  // Details (Section 2.1) - auto-filled from user
  reporterName: z.string().min(1, 'Reporter name is required'),
  reporterRole: z.string().min(1, 'Reporter role is required'),
  reporterDepartment: z.string().min(1, 'Reporter department is required'),
  reportDateTime: z.string().min(1, 'Report date/time is required'),

  // Incident Classification (Section 2.2)
  incidentClassification: incidentClassificationSchema,

  // Participant Classification (Section 2.3)
  participantClassification: participantClassificationSchema,

  // Participant Details (Section 2.4) - conditional
  participantDetails: participantDetailsSchema.optional(),

  // Incident Details (Section 2.5)
  incidentDateTime: z.string().min(1, 'Incident date/time is required'),
  incidentDepartment: departmentSchema,
  incidentLocation: z.string().min(1, 'Incident location is required'),
  incidentDescription: z.string().min(10, 'Description must be at least 10 characters'),
  incidentAttendees: z.array(attendeeSchema).optional(),

  // Initial Diagnosis (Section 2.6) - conditional, for patients
  initialDiagnosis: initialDiagnosisSchema.optional(),

  // Incident Handling (Section 2.7) - optional
  incidentHandling: incidentHandlingSchema.optional(),

  // Conclusion and Findings (Section 2.8)
  contributingIncidents: z.string().optional(),
  incidentFindings: z.string().min(1, 'Incident findings are required'),
  preventiveMeasures: z.string().optional(),

  // Attachments (Section 2.9) - optional
  attachments: z.array(attachmentSchema).optional(),
}).superRefine((data, ctx) => {
  // Validate participant details required when participant is not "no_participant"
  if (
    data.participantClassification !== 'no_participant' &&
    !data.participantDetails
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Participant details are required when a participant is involved',
      path: ['participantDetails'],
    });
  }

  // Validate hospitalized date/time required for hospitalized patients
  if (
    data.participantClassification === 'hospitalized_patient' &&
    data.participantDetails?.hospitalizedStatus === 'yes' &&
    !data.participantDetails?.hospitalizedDateTime
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Hospitalized date/time is required for hospitalized patients',
      path: ['participantDetails', 'hospitalizedDateTime'],
    });
  }

  // Validate initial diagnosis required for patient classifications
  const patientClassifications = [
    'ambulatory_patient',
    'hospitalized_patient',
    'er_patient',
  ];
  if (
    patientClassifications.includes(data.participantClassification) &&
    !data.initialDiagnosis
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Initial diagnosis is required for patients',
      path: ['initialDiagnosis'],
    });
  }
});

// Login form schema
export const loginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Type exports inferred from schemas
export type IncidentReportFormData = z.infer<typeof incidentReportFormSchema>;
export type ParticipantDetailsFormData = z.infer<typeof participantDetailsSchema>;
export type AttendeeFormData = z.infer<typeof attendeeSchema>;
export type InitialDiagnosisFormData = z.infer<typeof initialDiagnosisSchema>;
export type IncidentHandlingFormData = z.infer<typeof incidentHandlingSchema>;
export type DoctorPrognosisFormData = z.infer<typeof doctorPrognosisSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
