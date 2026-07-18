'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useRole, usePermission } from '../../contexts/AuthContext';
import { Role } from '@fonebox/types';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading session...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>;
  if (isAuthenticated) return null;

  return <>{children}</>;
};

export const RoleGuard = ({ children, roles }: { children: React.ReactNode; roles: Role[] }) => {
  const { isAuthorized, isLoading } = useRole(roles);
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading || !isAuthorized) return null;

  return <>{children}</>;
};

export const PermissionGuard = ({ children, action, resource }: { children: React.ReactNode; action: string; resource: string }) => {
  const { isAuthorized, isLoading } = usePermission(action, resource);
  
  if (isLoading || !isAuthorized) return null;

  return <>{children}</>;
};
