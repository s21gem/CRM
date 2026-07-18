'use client';

import * as React from 'react';
import { User, Role, Permission } from '@fonebox/types';

interface AuthContextType {
  user: User & { permissions?: Permission[] } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User & { permissions?: Permission[] }) => void;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  hasPermission: (action: string, resource: string) => boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User & { permissions?: Permission[] } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app, this would verify the HttpOnly cookie or stored token via /api/v1/auth/me
    const storedUser = localStorage.getItem('fbcrm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User & { permissions?: Permission[] }) => {
    setUser(userData);
    localStorage.setItem('fbcrm_user', JSON.stringify(userData));
    localStorage.setItem('fbcrm_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fbcrm_user');
    localStorage.removeItem('fbcrm_token');
    // Also call backend logout to clear cookie/session
    fetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    if (user.role === Role.SUPER_ADMIN) return true;
    return roles.includes(user.role);
  };

  const hasPermission = (action: string, resource: string) => {
    if (!user) return false;
    if (user.role === Role.SUPER_ADMIN) return true;
    if (!user.permissions) return false;
    return user.permissions.some(p => p.action === action && p.resource === resource);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRole = (roles: Role[]) => {
  const { hasRole, isLoading } = useAuth();
  return { isAuthorized: hasRole(roles), isLoading };
};

export const usePermission = (action: string, resource: string) => {
  const { hasPermission, isLoading } = useAuth();
  return { isAuthorized: hasPermission(action, resource), isLoading };
};
