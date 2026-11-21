import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthResponse } from '../types/auth';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isTerminalLocked: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  lockTerminal: () => void;
  unlockWithPin: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('triangle_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('triangle_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTerminalLocked, setIsTerminalLocked] = useState<boolean>(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const profile = await apiClient.get<UserProfile>('/auth/profile', token);
          setUser(profile);
          localStorage.setItem('triangle_user', JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const data = await apiClient.post<AuthResponse>('/auth/login', {
      usernameOrEmail,
      password,
    });
    setToken(data.accessToken);
    setUser(data.user);
    setIsTerminalLocked(false);
    localStorage.setItem('triangle_token', data.accessToken);
    localStorage.setItem('triangle_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsTerminalLocked(false);
    localStorage.removeItem('triangle_token');
    localStorage.removeItem('triangle_user');
  };

  const lockTerminal = () => {
    setIsTerminalLocked(true);
  };

  const unlockWithPin = async (pin: string) => {
    if (!token) throw new Error('No hay sesión activa');
    await apiClient.post<{ unlocked: boolean }>('/auth/unlock-pin', { pin }, token);
    setIsTerminalLocked(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        isTerminalLocked,
        login,
        logout,
        lockTerminal,
        unlockWithPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};
