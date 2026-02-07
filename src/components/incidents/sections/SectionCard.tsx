import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for form sections with consistent styling
 */
export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

interface FieldDisplayProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * Read-only field display component
 */
export function FieldDisplay({ label, value, className }: FieldDisplayProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || '-'}</dd>
    </div>
  );
}

interface FieldGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Grid layout for form fields
 */
export function FieldGrid({ children, columns = 2, className }: FieldGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <dl className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </dl>
  );
}

export { SectionCard as default };
