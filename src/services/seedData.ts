import type { IncidentReport } from '@/types';

// Sample data arrays for realistic variation
const reporters = [
  { name: 'Dr. Sarah Cohen', role: 'Physician', department: 'Emergency' },
  { name: 'Nurse David Levi', role: 'Nurse', department: 'General' },
  { name: 'Dr. Michael Ben-David', role: 'Physician', department: 'Surgery' },
  { name: 'Nurse Rachel Stern', role: 'Nurse', department: 'Pediatrics' },
  { name: 'Dr. Yael Goldstein', role: 'Physician', department: 'General' },
  { name: 'Nurse Amit Peretz', role: 'Nurse', department: 'Emergency' },
  { name: 'Dr. Noam Shapira', role: 'Physician', department: 'Ambulatory' },
  { name: 'Nurse Tamar Mizrachi', role: 'Nurse', department: 'Surgery' },
];

const incidentTypes = [
  'fall',
  'fall',
  'fall', // weighted more heavily
  'medication_error',
  'medication_error',
  'equipment_failure',
  'equipment_failure',
  'security',
  'infection',
  'infection',
  'other',
];

const departments = [
  'emergency',
  'emergency',
  'general',
  'general',
  'general',
  'surgery',
  'surgery',
  'pediatrics',
  'ambulatory',
  'other',
] as const;

const locations: Record<string, string[]> = {
  emergency: ['ER Bay 1', 'ER Bay 2', 'ER Bay 3', 'ER Hallway', 'Triage Area', 'ER Waiting Room'],
  general: ['Room 101', 'Room 102', 'Room 205', 'Room 310', 'Hallway A', 'Nurses Station'],
  surgery: ['Operating Room 1', 'Operating Room 2', 'Recovery Room', 'Pre-Op Area', 'Surgical Ward'],
  pediatrics: ['Room P101', 'Room P102', 'Playroom', 'Pediatric ICU', 'Nurses Station'],
  ambulatory: ['Clinic Room 1', 'Clinic Room 2', 'Waiting Area', 'Reception', 'Treatment Room'],
  other: ['Cafeteria', 'Lobby', 'Parking Lot', 'Administration', 'Laboratory'],
};

const firstNames = ['Yossi', 'Miriam', 'David', 'Sarah', 'Moshe', 'Leah', 'Avi', 'Ruth', 'Dan', 'Hana', 'Eli', 'Naomi'];
const lastNames = ['Cohen', 'Levi', 'Mizrachi', 'Peretz', 'Goldstein', 'Shapira', 'Ben-David', 'Stern', 'Avraham', 'Katz'];

const incidentDescriptions: Record<string, string[]> = {
  fall: [
    'Patient fell while attempting to get out of bed without assistance. Bed rails were down at the time of incident.',
    'Patient slipped on wet floor near bathroom. Area was recently mopped but warning signs were in place.',
    'Elderly patient lost balance while walking in hallway. Walker was available but not being used.',
    'Patient fell from wheelchair while attempting to reach item on nearby table.',
    'Patient tripped over medical equipment cord while walking to bathroom.',
  ],
  medication_error: [
    'Wrong dosage administered due to misread prescription. Patient received double the prescribed amount.',
    'Medication given to wrong patient due to similar names. Error caught within 30 minutes.',
    'Delayed medication administration due to pharmacy backlog. Patient missed scheduled dose.',
    'Incorrect medication route - oral medication given IV. Immediate intervention required.',
    'Allergic reaction occurred due to undocumented allergy in patient file.',
  ],
  equipment_failure: [
    'IV pump malfunction caused irregular medication delivery. Device removed from service.',
    'Patient monitor displayed false readings. Backup equipment deployed immediately.',
    'Bed control mechanism failed, patient unable to adjust position. Maintenance called.',
    'Oxygen delivery system showed irregular flow rates. Equipment replaced.',
    'Call button system failure in patient room. Temporary solution implemented.',
  ],
  security: [
    'Unauthorized visitor attempted to access restricted area. Security escort provided.',
    'Patient became agitated and attempted to leave against medical advice.',
    'Missing personal belongings reported by patient family member.',
    'Verbal altercation between visitors in waiting area. Security intervention required.',
    'Suspicious individual reported near medication storage area.',
  ],
  infection: [
    'Potential exposure to infectious patient identified. Contact tracing initiated.',
    'Needle stick injury occurred during blood draw procedure.',
    'Suspected nosocomial infection identified in post-operative patient.',
    'Breach in sterile technique observed during wound care.',
    'Patient developed signs of infection at IV insertion site.',
  ],
  other: [
    'Property damage occurred during patient transport. Wheelchair struck door frame.',
    'Documentation error discovered in patient records. Corrections made and verified.',
    'Communication breakdown between departments caused delayed procedure.',
    'Patient complaint regarding staff interaction. Supervisor notified.',
    'Near-miss incident identified during shift handover review.',
  ],
};

const findings: Record<string, string[]> = {
  fall: [
    'Patient attempted independent mobility despite care plan restrictions. Staff response was immediate.',
    'Environmental factors contributed to incident. Floor conditions being addressed.',
    'Patient mobility assessment may need updating. Fall risk protocol followed correctly.',
  ],
  medication_error: [
    'Double-check protocol was not fully followed. Additional training scheduled.',
    'System flagged potential error but alert was dismissed. Process review underway.',
    'Communication gap between pharmacy and nursing identified. New protocol proposed.',
  ],
  equipment_failure: [
    'Equipment was past scheduled maintenance date. Maintenance schedule being reviewed.',
    'User error ruled out; manufacturer notified of defect.',
    'Backup systems functioned correctly. Primary equipment sent for repair.',
  ],
  security: [
    'Visitor screening process followed correctly. Incident was unavoidable.',
    'Additional security measures being considered for this area.',
    'Staff de-escalation training was effective in resolving situation.',
  ],
  infection: [
    'Infection control protocols were followed. Source of exposure under investigation.',
    'PPE compliance was verified. Additional precautions implemented.',
    'Early identification allowed for prompt intervention and treatment.',
  ],
  other: [
    'Root cause analysis reveals systemic issue requiring policy review.',
    'Incident was isolated occurrence. No pattern identified.',
    'Communication protocols being updated based on findings.',
  ],
};

const preventiveMeasures: Record<string, string[]> = {
  fall: [
    'Bed alarm installed. Increased monitoring frequency. Patient education provided.',
    'Non-slip mats placed in high-risk areas. Hourly rounding implemented.',
    'Physical therapy consultation ordered. Mobility aids reviewed with patient.',
  ],
  medication_error: [
    'Barcode scanning mandatory for all medication administration. Staff re-educated.',
    'Pharmacy double-verification process enhanced. Alert fatigue being addressed.',
    'Patient identification protocol reinforced. Additional verification step added.',
  ],
  equipment_failure: [
    'Equipment replaced and maintenance schedule updated. Staff training on backup procedures.',
    'Preventive maintenance frequency increased. Spare equipment stock reviewed.',
    'New equipment procurement initiated. Temporary protocols in place.',
  ],
  security: [
    'Security patrol frequency increased. Staff awareness communication sent.',
    'Access control measures enhanced. Visitor policy under review.',
    'De-escalation training scheduled for all patient-facing staff.',
  ],
  infection: [
    'Enhanced cleaning protocols implemented. Staff PPE compliance audit scheduled.',
    'Isolation precautions upgraded. Contact tracing completed.',
    'Antibiotic stewardship review initiated. Infection markers being monitored.',
  ],
  other: [
    'Policy review committee meeting scheduled. Staff feedback being collected.',
    'Process improvement initiative launched. Metrics being tracked.',
    'Communication channels being streamlined. Training materials updated.',
  ],
};

const doctorNames = [
  'Dr. Amit Goldstein',
  'Dr. Yael Rosenberg',
  'Dr. Oren Levy',
  'Dr. Maya Cohen',
  'Dr. Eitan Shapira',
];

// Utility functions
const randomItem = <T>(arr: readonly T[] | T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBool = (probability = 0.5): boolean => Math.random() < probability;

const generateIdNumber = (): string => {
  return String(randomInt(100000000, 999999999));
};

const getRandomDateInLastDays = (days: number): Date => {
  const now = new Date();
  const daysAgo = randomInt(0, days);
  const hoursAgo = randomInt(0, 23);
  const minutesAgo = randomInt(0, 59);
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hoursAgo, minutesAgo, 0, 0);
  
  return date;
};

const generateIncident = (index: number): IncidentReport => {
  const incidentType = randomItem(incidentTypes);
  const department = randomItem(departments);
  const reporter = randomItem(reporters);
  const location = randomItem(locations[department] || locations.other);
  
  // Generate dates - spread over 6 months (180 days)
  const incidentDate = getRandomDateInLastDays(180);
  const reportDate = new Date(incidentDate);
  reportDate.setMinutes(reportDate.getMinutes() + randomInt(15, 120)); // Reported 15min-2hr after incident
  
  const createdAt = reportDate.toISOString();
  const updatedDate = new Date(reportDate);
  updatedDate.setHours(updatedDate.getHours() + randomInt(1, 48)); // Updated 1-48 hours later
  const updatedAt = updatedDate.toISOString();
  
  // Status weighted distribution: 60% closed, 25% open, 15% waiting
  const statusRoll = Math.random();
  const status = statusRoll < 0.6 ? 'closed' : statusRoll < 0.85 ? 'open' : 'waiting_for_approval';
  
  // Classification
  const incidentClassification = randomBool(0.7) ? 'abnormal' : 'almost';
  
  // Participant classification weighted
  const participantClassifications = [
    'hospitalized_patient',
    'hospitalized_patient',
    'hospitalized_patient',
    'ambulatory_patient',
    'visitor',
    'employee',
    'er_patient',
    'no_participant',
  ] as const;
  const participantClassification = randomItem(participantClassifications);
  
  // Generate participant details if applicable
  const hasParticipant = participantClassification !== 'no_participant';
  const participantDetails = hasParticipant
    ? {
        firstName: randomItem(firstNames),
        lastName: randomItem(lastNames),
        idNumber: generateIdNumber(),
        birthYear: randomInt(1940, 2010),
        gender: randomItem(['male', 'female'] as const),
        hospitalizedStatus: randomItem(['yes', 'no'] as const),
        hospitalizedDateTime:
          participantClassification === 'hospitalized_patient'
            ? new Date(incidentDate.getTime() - randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
      }
    : undefined;
  
  // Initial diagnosis for incidents with participants
  const initialDiagnosis = hasParticipant
    ? {
        consciousness: randomItem(['conscious', 'conscious', 'conscious', 'unconscious'] as const),
        mobility: randomItem(['mobile', 'partially_mobile', 'no_mobility'] as const),
        functionalStatus: randomItem([
          'independent',
          'partially_dependent',
          'dependent',
          'bedridden',
        ] as const),
        damage: randomItem(['no_damage', 'no_damage', 'minor_damage', 'major_damage'] as const),
        incidentResultsDetails:
          incidentType === 'fall'
            ? randomItem([
                'Minor bruising observed',
                'No visible injuries',
                'Small laceration on forearm',
                'Swelling on left knee',
                'Patient reports mild pain',
              ])
            : incidentType === 'medication_error'
              ? randomItem([
                  'No adverse reaction observed',
                  'Mild nausea reported',
                  'Vital signs stable',
                  'Patient monitored for 2 hours',
                ])
              : 'Incident documented, patient stable',
      }
    : undefined;
  
  // Incident handling
  const reportedToOptions = [
    'supervisor',
    'doctor_on_call',
    'shift_manager',
    'department_manager',
    'nursing_administration',
    'maintenance',
    'security',
  ] as const;
  
  const reportedTo = [
    randomItem(reportedToOptions),
    ...(randomBool(0.5) ? [randomItem(reportedToOptions)] : []),
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
  
  const doctorWasCalled = hasParticipant && randomBool(0.7);
  const doctorPrognosis = doctorWasCalled
    ? {
        doctorWasCalled: true,
        doctorName: randomItem(doctorNames),
        examinationOccurred: randomBool(0.9),
        doctorFindings: randomItem([
          'No significant findings. Patient stable.',
          'Minor injury observed. Treatment provided.',
          'Vitals normal. Continued monitoring recommended.',
          'X-ray ordered. No fractures detected.',
          'Blood work ordered. Results pending.',
        ]),
        prognosis: randomItem([
          'Full recovery expected',
          'Continue current treatment plan',
          'Follow-up in 24 hours',
          'Additional monitoring required',
          'No long-term effects anticipated',
        ]),
        sentToHospital: randomBool(0.1),
      }
    : { doctorWasCalled: false };
  
  const incidentHandling = {
    reportedTo: reportedTo as unknown as typeof reportedToOptions[number][],
    doctorPrognosis,
  };
  
  return {
    id: `INC-${String(index + 1).padStart(3, '0')}`,
    status,
    incidentType,
    reporterName: reporter.name,
    reporterRole: reporter.role,
    reporterDepartment: reporter.department,
    reportDateTime: reportDate.toISOString(),
    incidentClassification,
    participantClassification,
    participantDetails,
    incidentDateTime: incidentDate.toISOString(),
    incidentDepartment: department,
    incidentLocation: location,
    incidentDescription: randomItem(incidentDescriptions[incidentType] || incidentDescriptions.other),
    initialDiagnosis,
    incidentHandling,
    incidentFindings: randomItem(findings[incidentType] || findings.other),
    preventiveMeasures: status === 'closed' ? randomItem(preventiveMeasures[incidentType] || preventiveMeasures.other) : undefined,
    createdAt,
    updatedAt,
  };
};

/**
 * Generate seed incidents
 */
export const generateSeedIncidents = (count = 40): IncidentReport[] => {
  return Array.from({ length: count }, (_, i) => generateIncident(i));
};

/**
 * Seed incidents to localStorage if empty
 * Returns true if seeding occurred, false if data already existed
 * Note: Does not seed during tests (when import.meta.env.MODE === 'test')
 */
export const seedIncidentsIfEmpty = (): boolean => {
  // Don't seed during tests
  if (import.meta.env.MODE === 'test') {
    return false;
  }
  
  const STORAGE_KEY = 'incidents';
  const SEED_VERSION_KEY = 'incidents_seed_version';
  const CURRENT_SEED_VERSION = '3'; // Bump this to force re-seeding
  
  try {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    
    // Re-seed if version changed or no data exists
    if (storedVersion !== CURRENT_SEED_VERSION || !stored) {
      const seedData = generateSeedIncidents(40);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      return true;
    }
    
    // Check if data array is empty
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seedData = generateSeedIncidents(40);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      return true;
    }
    
    return false; // Data already exists with current version
  } catch {
    return false;
  }
};
