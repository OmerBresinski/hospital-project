import { useTranslation } from 'react-i18next';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import type { ParticipantDetails } from '@/types';

interface ParticipantSectionProps {
  data: ParticipantDetails | undefined;
}

export function ParticipantSection({ data }: ParticipantSectionProps) {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const getGenderLabel = (gender: string) => {
    return t(`form.participantDetails.${gender}`);
  };

  return (
    <SectionCard title={t('form.participantDetails.title')}>
      <FieldGrid columns={3}>
        <FieldDisplay
          label={t('form.participantDetails.firstName')}
          value={data.firstName}
        />
        <FieldDisplay
          label={t('form.participantDetails.lastName')}
          value={data.lastName}
        />
        <FieldDisplay
          label={t('form.participantDetails.idNumber')}
          value={data.idNumber}
        />
        <FieldDisplay
          label={t('form.participantDetails.birthYear')}
          value={data.birthYear}
        />
        <FieldDisplay
          label={t('form.participantDetails.gender')}
          value={getGenderLabel(data.gender)}
        />
        <FieldDisplay
          label={t('form.participantDetails.hospitalizedStatus')}
          value={data.hospitalizedStatus === 'yes' ? t('common.yes') : t('common.no')}
        />
        {data.hospitalizedDateTime && (
          <FieldDisplay
            label={t('form.participantDetails.hospitalizedDateTime')}
            value={data.hospitalizedDateTime}
          />
        )}
      </FieldGrid>
    </SectionCard>
  );
}

export default ParticipantSection;
