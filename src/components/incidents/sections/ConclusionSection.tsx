import { useTranslation } from 'react-i18next';
import { SectionCard, FieldDisplay } from './SectionCard';
import type { IncidentReport } from '@/types';

interface ConclusionSectionProps {
  data: Pick<IncidentReport, 'contributingIncidents' | 'incidentFindings' | 'preventiveMeasures'>;
}

export function ConclusionSection({ data }: ConclusionSectionProps) {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('form.conclusion.title')}>
      {data.contributingIncidents && (
        <FieldDisplay
          label={t('form.conclusion.contributingIncidents')}
          value={
            <p className="whitespace-pre-wrap text-sm">{data.contributingIncidents}</p>
          }
        />
      )}

      <FieldDisplay
        label={t('form.conclusion.incidentFindings')}
        value={
          <p className="whitespace-pre-wrap text-sm">{data.incidentFindings}</p>
        }
      />

      {data.preventiveMeasures && (
        <FieldDisplay
          label={t('form.conclusion.preventiveMeasures')}
          value={
            <p className="whitespace-pre-wrap text-sm">{data.preventiveMeasures}</p>
          }
        />
      )}
    </SectionCard>
  );
}

export default ConclusionSection;
