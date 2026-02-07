import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionProvider } from '@/components/ui/direction';
import { settingsApi } from '@/services/api';
import type { Locale, Direction } from '@/types';

interface LocaleContextType {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = useState<Locale>(
    () => settingsApi.getLocaleSync()
  );

  const direction: Direction = locale === 'he' ? 'rtl' : 'ltr';

  // Update document attributes when locale changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale, direction]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    i18n.changeLanguage(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, direction, setLocale }}>
      <DirectionProvider dir={direction}>{children}</DirectionProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
