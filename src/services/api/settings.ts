import type { Settings, Locale } from '@/types';

const STORAGE_KEY = 'app-settings';

const defaultSettings: Settings = {
  locale: 'en',
  theme: 'system',
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if running in browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Apply theme to document
 */
const applyTheme = (theme: Settings['theme']) => {
  if (!isBrowser) return;
  
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    root.classList.toggle('dark', systemDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

/**
 * Get theme synchronously (for initial render)
 */
const getThemeSync = (): Settings['theme'] => {
  if (!isBrowser) return 'system';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.theme || 'system';
    }
  } catch {
    // Ignore
  }
  return 'system';
};

// Apply theme on initial load (only in browser)
if (isBrowser) {
  applyTheme(getThemeSync());

  // Listen for system theme changes when in 'system' mode
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemeSync() === 'system') {
      applyTheme('system');
    }
  });
}

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
    
    // Apply theme if changed
    if (settings.theme) {
      applyTheme(settings.theme);
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
