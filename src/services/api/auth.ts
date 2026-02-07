import type { User, LoginCredentials } from '@/types';

const STORAGE_KEY = 'auth-user';

// Mock users for demo
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'nurse1',
    password: 'password',
    name: 'Sarah Cohen',
    role: 'Nurse',
    department: 'Emergency',
  },
  {
    id: '2',
    username: 'doctor1',
    password: 'password',
    name: 'David Levi',
    role: 'Doctor',
    department: 'General',
  },
  {
    id: '3',
    username: 'admin',
    password: 'admin',
    name: 'Rachel Green',
    role: 'Administrator',
    department: 'Administration',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  /**
   * Login with credentials
   * Returns user data or throws error
   */
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(500); // Simulate network delay

    const user = mockUsers.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Store user in localStorage (without password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Get current authenticated user
   * Returns null if not authenticated
   */
  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  /**
   * Check if user is authenticated (synchronous for guards)
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
