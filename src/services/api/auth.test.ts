import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi } from './auth';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await authApi.login({
        username: 'nurse1',
        password: 'password',
      });

      expect(user).toEqual({
        id: '1',
        username: 'nurse1',
        name: 'Sarah Cohen',
        role: 'Nurse',
        department: 'Emergency',
      });
    });

    it('should store user in localStorage on successful login', async () => {
      await authApi.login({
        username: 'nurse1',
        password: 'password',
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth-user',
        expect.any(String)
      );
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        authApi.login({
          username: 'invalid',
          password: 'invalid',
        })
      ).rejects.toThrow('Invalid username or password');
    });

    it('should not include password in stored user', async () => {
      await authApi.login({
        username: 'nurse1',
        password: 'password',
      });

      const storedCall = vi.mocked(localStorage.setItem).mock.calls.find(
        (call) => call[0] === 'auth-user'
      );
      expect(storedCall).toBeDefined();
      
      const storedUser = JSON.parse(storedCall![1]);
      expect(storedUser).not.toHaveProperty('password');
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', async () => {
      // Login first
      await authApi.login({
        username: 'nurse1',
        password: 'password',
      });

      // Then logout
      await authApi.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', async () => {
      const user = await authApi.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return user when logged in', async () => {
      // Login first
      await authApi.login({
        username: 'nurse1',
        password: 'password',
      });

      // Mock localStorage.getItem to return the stored user
      const storedUser = {
        id: '1',
        username: 'nurse1',
        name: 'Sarah Cohen',
        role: 'Nurse',
        department: 'Emergency',
      };
      vi.mocked(localStorage.getItem).mockReturnValueOnce(
        JSON.stringify(storedUser)
      );

      const user = await authApi.getCurrentUser();
      expect(user).toEqual(storedUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce(null);
      expect(authApi.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', () => {
      vi.mocked(localStorage.getItem).mockReturnValueOnce('{"id": "1"}');
      expect(authApi.isAuthenticated()).toBe(true);
    });
  });
});
