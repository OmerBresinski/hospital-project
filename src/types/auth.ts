export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  department: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
