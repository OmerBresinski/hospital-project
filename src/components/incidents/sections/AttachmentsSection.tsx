import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { SectionCard } from './SectionCard';
import { FileIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Attachment } from '@/types';

interface AttachmentsSectionProps {
  data: Attachment[] | undefined;
  onRemove?: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AttachmentsSection({ data, onRemove }: AttachmentsSectionProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <SectionCard title={t('form.attachments.title')}>
        <p className="text-sm text-muted-foreground">{t('form.attachments.noFiles')}</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={t('form.attachments.title')}>
      <ul className="space-y-2">
        {data.map((attachment) => (
          <li
            key={attachment.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <FileIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{attachment.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.fileSize)} • {format(new Date(attachment.uploadedAt), 'PPp')}
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(attachment.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">{t('form.attachments.remove')}</span>
              </Button>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export default AttachmentsSection;
