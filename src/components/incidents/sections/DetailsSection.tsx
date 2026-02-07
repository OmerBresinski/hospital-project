import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import type { IncidentReport } from '@/types';

interface DetailsSectionProps {
  data: Pick<IncidentReport, 'reporterName' | 'reporterRole' | 'reporterDepartment' | 'reportDateTime'>;
}

export function DetailsSection({ data }: DetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('form.details.title')}>
      <FieldGrid columns={2}>
        <FieldDisplay
          label={t('form.details.reporterName')}
          value={data.reporterName}
        />
        <FieldDisplay
          label={t('form.details.reporterRole')}
          value={data.reporterRole}
        />
        <FieldDisplay
          label={t('form.details.reporterDepartment')}
          value={data.reporterDepartment}
        />
        <FieldDisplay
          label={t('form.details.reportDateTime')}
          value={data.reportDateTime ? format(new Date(data.reportDateTime), 'PPp') : undefined}
        />
      </FieldGrid>
    </SectionCard>
  );
}

export default DetailsSection;
