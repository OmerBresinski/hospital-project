import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIncident } from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  DetailsSection,
  ClassificationSection,
  ParticipantSection,
  IncidentDetailsSection,
  InitialDiagnosisSection,
  HandlingSection,
  ConclusionSection,
  AttachmentsSection,
} from '@/components/incidents';
import { ArrowLeft } from 'lucide-react';

export function IncidentDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError, error } = useIncident(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">{t('common.error')}</p>
        <p className="text-muted-foreground text-sm">{error?.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/incidents')}
        >
          <ArrowLeft className="mr-2 size-4" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">Incident not found</p>
        <Button
          variant="outline"
          onClick={() => navigate('/incidents')}
        >
          <ArrowLeft className="mr-2 size-4" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/incidents')}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">{t('common.back')}</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('incidents.incidentDetails')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('incidents.columns.id')}: {incident.id}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1: Details (Reporter info) */}
        <DetailsSection data={incident} />

        {/* Section 2: Classification */}
        <ClassificationSection data={incident} />

        {/* Section 3: Participant Details (conditional) */}
        <ParticipantSection data={incident.participantDetails} />

        {/* Section 4: Incident Details */}
        <IncidentDetailsSection data={incident} />

        {/* Section 5: Initial Diagnosis (conditional) */}
        <InitialDiagnosisSection data={incident.initialDiagnosis} />

        {/* Section 6: Incident Handling */}
        <HandlingSection data={incident.incidentHandling} />

        {/* Section 7: Conclusion and Findings */}
        <ConclusionSection data={incident} />

        {/* Section 8: Attachments */}
        <AttachmentsSection data={incident.attachments} />
      </div>
    </div>
  );
}

export default IncidentDetailsPage;
