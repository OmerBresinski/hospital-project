import { describe, it, expect, beforeEach, vi } from 'vitest';
import { settingsApi } from './settings';

describe('settingsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset document attributes
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  });

  describe('get', () => {
    it('should return default settings when none stored', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);

      const settings = await settingsApi.get();

      expect(settings).toEqual({
        locale: 'en',
        theme: 'system',
      });
    });

    it('should return stored settings merged with defaults', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify({ locale: 'he' })
      );

      const settings = await settingsApi.get();

      expect(settings).toEqual({
        locale: 'he',
        theme: 'system',
      });
    });

    it('should handle invalid JSON gracefully', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce('invalid json');

      const settings = await settingsApi.get();

      expect(settings).toEqual({
        locale: 'en',
        theme: 'system',
      });
    });
  });

  describe('update', () => {
    it('should update settings in localStorage', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);

      await settingsApi.update({ locale: 'he' });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'app-settings',
        expect.stringContaining('"locale":"he"')
      );
    });

    it('should merge with existing settings', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify({ locale: 'en', theme: 'dark' })
      );

      const updated = await settingsApi.update({ locale: 'he' });

      expect(updated).toEqual({
        locale: 'he',
        theme: 'dark',
      });
    });

    it('should update document direction when locale changes to Hebrew', async () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);

      await settingsApi.update({ locale: 'he' });

      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('he');
    });

    it('should update document direction when locale changes to English', async () => {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify({ locale: 'he' })
      );

      await settingsApi.update({ locale: 'en' });

      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
    });
  });

  describe('getLocaleSync', () => {
    it('should return "en" when no settings stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);

      expect(settingsApi.getLocaleSync()).toBe('en');
    });

    it('should return stored locale', () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify({ locale: 'he' })
      );

      expect(settingsApi.getLocaleSync()).toBe('he');
    });

    it('should handle invalid JSON gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce('invalid');

      expect(settingsApi.getLocaleSync()).toBe('en');
    });
  });
});
