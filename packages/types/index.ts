export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CRM_MANAGER = 'CRM_MANAGER',
  SALES = 'SALES',
  SUPPORT = 'SUPPORT',
  ENGINEER = 'ENGINEER',
  CUSTOMER = 'CUSTOMER',
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
  lastActivity: Date;
  expiresAt: Date;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  session: SessionInfo;
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
}
