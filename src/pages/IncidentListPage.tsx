import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useIncidents } from '@/hooks/queries';
import { StatusBadge } from '@/components/incidents';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import type { IncidentListItem } from '@/types';

export function IncidentListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: incidents, isLoading, isError, error } = useIncidents();

  // Department translation helper
  const getDepartmentLabel = (department: string) => {
    const key = `form.departments.${department}` as const;
    return t(key);
  };

  // Incident type translation helper
  const getTypeLabel = (type: string) => {
    const key = `form.incidentType.${type}` as const;
    return t(key);
  };

  const handleRowClick = (incident: IncidentListItem) => {
    navigate(`/incidents/${incident.id}`);
  };

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('incidents.title')}</h1>
        <Button onClick={() => navigate('/incidents/new')}>
          <Plus className="mr-2 size-4" />
          {t('incidents.newIncident')}
        </Button>
      </div>

      {/* Table */}
      {incidents && incidents.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('incidents.columns.id')}</TableHead>
                <TableHead>{t('incidents.columns.type')}</TableHead>
                <TableHead>{t('incidents.columns.dateTime')}</TableHead>
                <TableHead>{t('incidents.columns.reporter')}</TableHead>
                <TableHead>{t('incidents.columns.department')}</TableHead>
                <TableHead>{t('incidents.columns.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  onClick={() => handleRowClick(incident)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{getTypeLabel(incident.incidentType)}</TableCell>
                  <TableCell>
                    {format(new Date(incident.reportDateTime), 'PPp')}
                  </TableCell>
                  <TableCell>{incident.reporterName}</TableCell>
                  <TableCell>
                    {getDepartmentLabel(incident.incidentDepartment)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={incident.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border p-8 text-center">
          <p className="text-muted-foreground mb-4">{t('incidents.noIncidents')}</p>
          <Button onClick={() => navigate('/incidents/new')}>
            <Plus className="mr-2 size-4" />
            {t('incidents.newIncident')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default IncidentListPage;
