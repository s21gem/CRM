'use client';

import * as React from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // Skeleton implementation for AuthGuard.
  // Will be implemented in Prompt 2.
  return <>{children}</>;
};

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  // Skeleton implementation for GuestGuard.
  // Will be implemented in Prompt 2.
  return <>{children}</>;
};

export const RoleGuard = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  // Skeleton implementation for RoleGuard.
  // Will be implemented in Prompt 2.
  return <>{children}</>;
};

export const PermissionGuard = ({ children, requiredPermissions }: { children: React.ReactNode; requiredPermissions: string[] }) => {
  // Skeleton implementation for PermissionGuard.
  // Will be implemented in Prompt 2.
  return <>{children}</>;
};
