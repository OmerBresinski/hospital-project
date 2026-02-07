import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useLocale } from '@/contexts';
import { useUpdateSettings } from '@/hooks/mutations';
import { useSettings } from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import type { Locale } from '@/types';

export function SettingsPage() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { data: settings, isPending } = useSettings();
  const updateSettings = useUpdateSettings();

  // Local state for form - only updates on save
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);

  // Use selectedLocale if set, otherwise fall back to saved settings or context
  const currentLocale = selectedLocale ?? settings?.locale ?? locale;

  // Check if there are unsaved changes
  const hasChanges = selectedLocale !== null && selectedLocale !== (settings?.locale ?? locale);

  const handleSave = async () => {
    if (!selectedLocale) return;

    try {
      await updateSettings.mutateAsync({ locale: selectedLocale });
      setLocale(selectedLocale);
      setSelectedLocale(null); // Reset local state after save
      toast.success(t('settings.saved'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
          <CardDescription>{t('settings.languageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentLocale}
            onValueChange={(value) => setSelectedLocale(value as Locale)}
            className="space-y-3"
          >
            <Field orientation="horizontal">
              <RadioGroupItem value="en" id="locale-en" />
              <FieldLabel htmlFor="locale-en">
                {t('settings.english')}
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="he" id="locale-he" />
              <FieldLabel htmlFor="locale-he">
                {t('settings.hebrew')}
              </FieldLabel>
            </Field>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                {t('common.loading')}
              </>
            ) : (
              t('common.save')
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SettingsPage;
