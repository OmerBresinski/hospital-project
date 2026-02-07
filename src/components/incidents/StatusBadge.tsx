import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig: Record<ReportStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    open: {
      label: t('form.status.open'),
      variant: 'destructive',
    },
    waiting_for_approval: {
      label: t('form.status.waitingForApproval'),
      variant: 'secondary',
    },
    closed: {
      label: t('form.status.closed'),
      variant: 'outline',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
