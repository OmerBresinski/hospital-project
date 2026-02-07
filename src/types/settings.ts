export type Locale = 'en' | 'he';
export type Direction = 'ltr' | 'rtl';

export interface Settings {
  locale: Locale;
  theme: 'light' | 'dark' | 'system';
}
