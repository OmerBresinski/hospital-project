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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import type { Locale, Settings } from '@/types';

type Theme = Settings['theme'];

export function SettingsPage() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { data: settings, isPending } = useSettings();
  const updateSettings = useUpdateSettings();

  // Local state for form - only updates on save
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  // Use selected values if set, otherwise fall back to saved settings or defaults
  const currentLocale = selectedLocale ?? settings?.locale ?? locale;
  const currentTheme = selectedTheme ?? settings?.theme ?? 'system';

  // Check if there are unsaved changes
  const hasLocaleChange = selectedLocale !== null && selectedLocale !== (settings?.locale ?? locale);
  const hasThemeChange = selectedTheme !== null && selectedTheme !== (settings?.theme ?? 'system');
  const hasChanges = hasLocaleChange || hasThemeChange;

  const handleSave = async () => {
    if (!hasChanges) return;

    const updates: Partial<Settings> = {};
    if (selectedLocale) updates.locale = selectedLocale;
    if (selectedTheme) updates.theme = selectedTheme;

    try {
      await updateSettings.mutateAsync(updates);
      if (selectedLocale) {
        setLocale(selectedLocale);
      }
      // Reset local state after save
      setSelectedLocale(null);
      setSelectedTheme(null);
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

      {/* Language Card */}
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
      </Card>

      {/* Theme Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.theme')}</CardTitle>
          <CardDescription>{t('settings.themeDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentTheme}
            onValueChange={(value) => setSelectedTheme(value as Theme)}
            className="space-y-3"
          >
            <Field orientation="horizontal">
              <RadioGroupItem value="light" id="theme-light" />
              <FieldLabel htmlFor="theme-light">
                {t('settings.light')}
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="dark" id="theme-dark" />
              <FieldLabel htmlFor="theme-dark">
                {t('settings.dark')}
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="system" id="theme-system" />
              <FieldLabel htmlFor="theme-system">
                {t('settings.system')}
              </FieldLabel>
            </Field>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
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
      </div>
    </div>
  );
}

export default SettingsPage;
