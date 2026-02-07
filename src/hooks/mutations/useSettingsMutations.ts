import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { settingsApi } from '@/services/api';
import { settingsKeys } from '@/hooks/queries';
import type { Settings } from '@/types';

/**
 * Hook to update settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation({
    mutationFn: (updates: Partial<Settings>) => settingsApi.update(updates),
    onSuccess: (updatedSettings) => {
      // Update the settings cache
      queryClient.setQueryData(settingsKeys.current(), updatedSettings);

      // Update i18n language if locale changed
      if (updatedSettings.locale && i18n.language !== updatedSettings.locale) {
        i18n.changeLanguage(updatedSettings.locale);
      }
    },
  });
}
