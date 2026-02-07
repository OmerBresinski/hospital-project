import { describe, it, expect } from 'vitest';
import {
  incidentReportFormSchema,
  loginFormSchema,
  participantDetailsSchema,
  attendeeSchema,
} from './validations';

describe('Validation Schemas', () => {
  describe('loginFormSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        username: 'nurse1',
        password: 'password',
      };
      
      const result = loginFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password',
      };
      
      const result = loginFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        username: 'nurse1',
        password: '',
      };
      
      const result = loginFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('participantDetailsSchema', () => {
    it('should validate valid participant details', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        idNumber: '123456789',
        birthYear: 1990,
        gender: 'male',
        hospitalizedStatus: 'no',
      };
      
      const result = participantDetailsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid birth year', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        idNumber: '123456789',
        birthYear: 1800, // Too old
        gender: 'male',
        hospitalizedStatus: 'no',
      };
      
      const result = participantDetailsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should coerce string birth year to number', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        idNumber: '123456789',
        birthYear: '1990',
        gender: 'male',
        hospitalizedStatus: 'no',
      };
      
      const result = participantDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.birthYear).toBe(1990);
      }
    });
  });

  describe('attendeeSchema', () => {
    it('should validate valid attendee', () => {
      const validData = {
        name: 'Jane Doe',
        role: 'employee',
      };
      
      const result = attendeeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        role: 'employee',
      };
      
      const result = attendeeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const invalidData = {
        name: 'Jane Doe',
        role: 'invalid_role',
      };
      
      const result = attendeeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('incidentReportFormSchema', () => {
    const baseValidData = {
      status: 'open',
      incidentType: 'medical',
      reporterName: 'Sarah Cohen',
      reporterRole: 'Nurse',
      reporterDepartment: 'Emergency',
      reportDateTime: '2024-01-15T10:00:00.000Z',
      incidentClassification: 'abnormal',
      participantClassification: 'no_participant',
      incidentDateTime: '2024-01-15T09:00:00.000Z',
      incidentDepartment: 'emergency',
      incidentLocation: 'Room 101',
      incidentDescription: 'This is a test incident description that is long enough.',
      incidentFindings: 'Test findings',
    };

    it('should validate valid incident report with no participant', () => {
      const result = incidentReportFormSchema.safeParse(baseValidData);
      expect(result.success).toBe(true);
    });

    it('should require participant details when participant is involved', () => {
      const dataWithParticipant = {
        ...baseValidData,
        participantClassification: 'visitor',
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithParticipant);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => 
          i.path.includes('participantDetails')
        )).toBe(true);
      }
    });

    it('should validate incident report with participant details', () => {
      const dataWithParticipant = {
        ...baseValidData,
        participantClassification: 'visitor',
        participantDetails: {
          firstName: 'John',
          lastName: 'Doe',
          idNumber: '123456789',
          birthYear: 1990,
          gender: 'male',
          hospitalizedStatus: 'no',
        },
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithParticipant);
      expect(result.success).toBe(true);
    });

    it('should require initial diagnosis for patient classifications', () => {
      const dataWithPatient = {
        ...baseValidData,
        participantClassification: 'hospitalized_patient',
        participantDetails: {
          firstName: 'John',
          lastName: 'Doe',
          idNumber: '123456789',
          birthYear: 1990,
          gender: 'male',
          hospitalizedStatus: 'no',
        },
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithPatient);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => 
          i.path.includes('initialDiagnosis')
        )).toBe(true);
      }
    });

    it('should validate incident report with patient and initial diagnosis', () => {
      const dataWithPatientDiagnosis = {
        ...baseValidData,
        participantClassification: 'hospitalized_patient',
        participantDetails: {
          firstName: 'John',
          lastName: 'Doe',
          idNumber: '123456789',
          birthYear: 1990,
          gender: 'male',
          hospitalizedStatus: 'no',
        },
        initialDiagnosis: {
          consciousness: 'conscious',
          mobility: 'mobile',
          functionalStatus: 'independent',
          damage: 'no_damage',
        },
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithPatientDiagnosis);
      expect(result.success).toBe(true);
    });

    it('should reject too short description', () => {
      const dataWithShortDescription = {
        ...baseValidData,
        incidentDescription: 'Short',
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithShortDescription);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const dataWithOptionals = {
        ...baseValidData,
        contributingIncidents: 'Some contributing factors',
        preventiveMeasures: 'Some preventive measures',
        incidentAttendees: [
          { name: 'Jane Doe', role: 'employee' },
        ],
      };
      
      const result = incidentReportFormSchema.safeParse(dataWithOptionals);
      expect(result.success).toBe(true);
    });
  });
});
