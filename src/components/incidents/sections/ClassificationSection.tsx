import { useTranslation } from 'react-i18next';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import { StatusBadge } from '../StatusBadge';
import type { IncidentReport } from '@/types';

interface ClassificationSectionProps {
  data: Pick<IncidentReport, 'status' | 'incidentType' | 'incidentClassification' | 'participantClassification'>;
}

export function ClassificationSection({ data }: ClassificationSectionProps) {
  const { t } = useTranslation();

  // Helper to get translated labels
  const getClassificationLabel = (classification: string) => {
    return t(`form.classification.${classification}`);
  };

  const getParticipantLabel = (participant: string) => {
    // Map snake_case to camelCase for translations
    const keyMap: Record<string, string> = {
      visitor: 'visitor',
      ambulatory_patient: 'ambulatoryPatient',
      hospitalized_patient: 'hospitalizedPatient',
      er_patient: 'erPatient',
      employee: 'employee',
      no_participant: 'noParticipant',
      other: 'other',
    };
    return t(`form.participant.${keyMap[participant] || participant}`);
  };

  const getTypeLabel = (type: string) => {
    return t(`form.incidentType.${type}`);
  };

  return (
    <SectionCard title={t('form.classification.title')}>
      <FieldGrid columns={2}>
        <FieldDisplay
          label={t('form.status.title')}
          value={<StatusBadge status={data.status} />}
        />
        <FieldDisplay
          label={t('form.incidentType.title')}
          value={getTypeLabel(data.incidentType)}
        />
        <FieldDisplay
          label={t('form.classification.title')}
          value={getClassificationLabel(data.incidentClassification)}
        />
        <FieldDisplay
          label={t('form.participant.title')}
          value={getParticipantLabel(data.participantClassification)}
        />
      </FieldGrid>
    </SectionCard>
  );
}

export default ClassificationSection;
