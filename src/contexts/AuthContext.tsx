import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useCurrentUser } from '@/hooks/queries';
import { useLogin, useLogout } from '@/hooks/mutations';
import type { User, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loginError: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isPending } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (credentials: LoginCredentials): Promise<User> => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async (): Promise<void> => {
    return logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isPending,
        login,
        logout,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        loginError: loginMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
