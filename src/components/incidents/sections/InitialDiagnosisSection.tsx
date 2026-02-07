import { useTranslation } from 'react-i18next';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import type { InitialDiagnosis } from '@/types';

interface InitialDiagnosisSectionProps {
  data: InitialDiagnosis | undefined;
}

export function InitialDiagnosisSection({ data }: InitialDiagnosisSectionProps) {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const getConsciousnessLabel = (value: string) => {
    const keyMap: Record<string, string> = {
      conscious: 'conscious',
      unconscious: 'unconscious',
      no_consciousness: 'noConsciousness',
    };
    return t(`form.initialDiagnosis.${keyMap[value] || value}`);
  };

  const getMobilityLabel = (value: string) => {
    const keyMap: Record<string, string> = {
      mobile: 'mobile',
      partially_mobile: 'partiallyMobile',
      no_mobility: 'noMobility',
    };
    return t(`form.initialDiagnosis.${keyMap[value] || value}`);
  };

  const getFunctionalStatusLabel = (value: string) => {
    const keyMap: Record<string, string> = {
      independent: 'independent',
      partially_dependent: 'partiallyDependent',
      dependent: 'dependent',
      bedridden: 'bedridden',
    };
    return t(`form.initialDiagnosis.${keyMap[value] || value}`);
  };

  const getDamageLabel = (value: string) => {
    const keyMap: Record<string, string> = {
      no_damage: 'noDamage',
      minor_damage: 'minorDamage',
      major_damage: 'majorDamage',
      unknown: 'unknown',
    };
    return t(`form.initialDiagnosis.${keyMap[value] || value}`);
  };

  return (
    <SectionCard title={t('form.initialDiagnosis.title')}>
      <FieldGrid columns={2}>
        <FieldDisplay
          label={t('form.initialDiagnosis.consciousness')}
          value={getConsciousnessLabel(data.consciousness)}
        />
        <FieldDisplay
          label={t('form.initialDiagnosis.mobility')}
          value={getMobilityLabel(data.mobility)}
        />
        <FieldDisplay
          label={t('form.initialDiagnosis.functionalStatus')}
          value={getFunctionalStatusLabel(data.functionalStatus)}
        />
        <FieldDisplay
          label={t('form.initialDiagnosis.damage')}
          value={getDamageLabel(data.damage)}
        />
      </FieldGrid>

      {data.incidentResultsDetails && (
        <FieldDisplay
          label={t('form.initialDiagnosis.incidentResults')}
          value={
            <p className="whitespace-pre-wrap text-sm">{data.incidentResultsDetails}</p>
          }
        />
      )}
    </SectionCard>
  );
}

export default InitialDiagnosisSection;
