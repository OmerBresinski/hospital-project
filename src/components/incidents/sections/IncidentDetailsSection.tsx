import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import type { IncidentReport, Attendee } from '@/types';

interface IncidentDetailsSectionProps {
  data: Pick<
    IncidentReport,
    'incidentDateTime' | 'incidentDepartment' | 'incidentLocation' | 'incidentDescription' | 'incidentAttendees'
  >;
}

export function IncidentDetailsSection({ data }: IncidentDetailsSectionProps) {
  const { t } = useTranslation();

  const getDepartmentLabel = (dept: string) => {
    return t(`form.departments.${dept}`);
  };

  const getAttendeeRoleLabel = (role: string) => {
    const keyMap: Record<string, string> = {
      visitor: 'visitor',
      ambulatory_patient: 'ambulatoryPatient',
      hospitalized_patient: 'hospitalizedPatient',
      er_patient: 'erPatient',
      employee: 'employee',
      other: 'other',
    };
    return t(`form.participant.${keyMap[role] || role}`);
  };

  return (
    <SectionCard title={t('form.incidentDetails.title')}>
      <FieldGrid columns={2}>
        <FieldDisplay
          label={t('form.incidentDetails.dateTime')}
          value={data.incidentDateTime ? format(new Date(data.incidentDateTime), 'PPp') : undefined}
        />
        <FieldDisplay
          label={t('form.incidentDetails.department')}
          value={getDepartmentLabel(data.incidentDepartment)}
        />
        <FieldDisplay
          label={t('form.incidentDetails.location')}
          value={data.incidentLocation}
        />
      </FieldGrid>

      <FieldDisplay
        label={t('form.incidentDetails.description')}
        value={
          <p className="whitespace-pre-wrap text-sm">{data.incidentDescription}</p>
        }
      />

      {data.incidentAttendees && data.incidentAttendees.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('form.incidentDetails.attendees')}
          </h4>
          <ul className="space-y-2">
            {data.incidentAttendees.map((attendee: Attendee, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="font-medium">{attendee.name}</span>
                <span className="text-muted-foreground">
                  ({getAttendeeRoleLabel(attendee.role)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}

export default IncidentDetailsSection;
