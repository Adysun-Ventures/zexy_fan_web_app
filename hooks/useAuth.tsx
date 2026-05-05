'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService, type User, type SendOTPRequest, type VerifyOTPRequest } from '@/services/auth';
import { queryClient } from '@/lib/queryClient';

// ============================================================================
// CONTEXT
// ============================================================================

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Listen for session expiry
    const handleSessionExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    queryClient.clear();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

// ============================================================================
// HOOKS
// ============================================================================

export function useSendOTP() {
  return useMutation({
    mutationFn: (data: SendOTPRequest) => authService.sendOTP(data),
  });
}

export function useVerifyOTP() {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authService.verifyOTP(data),
    onSuccess: async (response) => {
      // Fetch user profile
      const user = await authService.getMe();
      login(response.access_token, user);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthContext();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
}
