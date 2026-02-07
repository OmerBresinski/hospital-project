import { useTranslation } from 'react-i18next';
import { SectionCard, FieldDisplay, FieldGrid } from './SectionCard';
import { Badge } from '@/components/ui/badge';
import type { IncidentHandling, ReportedTo } from '@/types';

interface HandlingSectionProps {
  data: IncidentHandling | undefined;
}

export function HandlingSection({ data }: HandlingSectionProps) {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const getReportedToLabel = (value: string) => {
    const keyMap: Record<string, string> = {
      supervisor: 'supervisor',
      general_supervisor: 'generalSupervisor',
      shift_manager: 'shiftManager',
      epidemiologist_nurse: 'epidemiologistNurse',
      maintenance: 'maintenance',
      it: 'it',
      guardian: 'guardian',
      security: 'security',
      police: 'police',
      bio_engineer: 'bioEngineer',
      hospital_management: 'hospitalManagement',
      nursing_administration: 'nursingAdministration',
      administrative_manager: 'administrativeManager',
      department_manager: 'departmentManager',
      healthcare_facilities_supervisor: 'healthcareFacilitiesSupervisor',
      family: 'family',
      doctor_on_call: 'doctorOnCall',
      active_doctor: 'activeDoctor',
      clinical_pharmacist: 'clinicalPharmacist',
      other: 'other',
    };
    return t(`form.handling.${keyMap[value] || value}`);
  };

  const { doctorPrognosis } = data;

  return (
    <SectionCard title={t('form.handling.title')}>
      {/* Reported To */}
      {data.reportedTo && data.reportedTo.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('form.handling.reportedTo')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.reportedTo.map((item: ReportedTo) => (
              <Badge key={item} variant="secondary">
                {getReportedToLabel(item)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Prognosis */}
      {doctorPrognosis && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-sm font-medium">{t('form.doctorPrognosis.title')}</h4>
          
          <FieldGrid columns={2}>
            <FieldDisplay
              label={t('form.doctorPrognosis.doctorWasCalled')}
              value={doctorPrognosis.doctorWasCalled ? t('common.yes') : t('common.no')}
            />
            {doctorPrognosis.doctorName && (
              <FieldDisplay
                label={t('form.doctorPrognosis.doctorName')}
                value={doctorPrognosis.doctorName}
              />
            )}
            {doctorPrognosis.examinationOccurred !== undefined && (
              <FieldDisplay
                label={t('form.doctorPrognosis.examinationOccurred')}
                value={doctorPrognosis.examinationOccurred ? t('common.yes') : t('common.no')}
              />
            )}
            {doctorPrognosis.sentToHospital !== undefined && (
              <FieldDisplay
                label={t('form.doctorPrognosis.sentToHospital')}
                value={doctorPrognosis.sentToHospital ? t('common.yes') : t('common.no')}
              />
            )}
          </FieldGrid>

          {doctorPrognosis.doctorFindings && (
            <FieldDisplay
              label={t('form.doctorPrognosis.doctorFindings')}
              value={
                <p className="whitespace-pre-wrap text-sm">{doctorPrognosis.doctorFindings}</p>
              }
            />
          )}

          {doctorPrognosis.prognosis && (
            <FieldDisplay
              label={t('form.doctorPrognosis.prognosis')}
              value={
                <p className="whitespace-pre-wrap text-sm">{doctorPrognosis.prognosis}</p>
              }
            />
          )}

          {doctorPrognosis.sentToHospital && (
            <FieldGrid columns={2}>
              {doctorPrognosis.sentParticipantName && (
                <FieldDisplay
                  label={t('form.doctorPrognosis.participantName')}
                  value={doctorPrognosis.sentParticipantName}
                />
              )}
              {doctorPrognosis.hospitalName && (
                <FieldDisplay
                  label={t('form.doctorPrognosis.hospitalName')}
                  value={doctorPrognosis.hospitalName}
                />
              )}
            </FieldGrid>
          )}
        </div>
      )}
    </SectionCard>
  );
}

export default HandlingSection;
