import type { Settings, Locale } from '@/types';

const STORAGE_KEY = 'app-settings';

const defaultSettings: Settings = {
  locale: 'en',
  theme: 'system',
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsApi = {
  /**
   * Get current settings
   * Future: Replace with fetch('/api/settings')
   */
  get: async (): Promise<Settings> => {
    await delay(100);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parsing errors
    }
    
    return defaultSettings;
  },

  /**
   * Update settings
   * Future: Replace with fetch('/api/settings', { method: 'PUT', body: JSON.stringify(settings) })
   */
  update: async (settings: Partial<Settings>): Promise<Settings> => {
    await delay(200);
    
    const current = await settingsApi.get();
    const updated = { ...current, ...settings };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Update document direction if locale changed
    if (settings.locale) {
      const direction = settings.locale === 'he' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = settings.locale;
    }
    
    return updated;
  },

  /**
   * Get locale synchronously (for initial render)
   */
  getLocaleSync: (): Locale => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.locale || 'en';
      }
    } catch {
      // Ignore
    }
    return 'en';
  },
};
