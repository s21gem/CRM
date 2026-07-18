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
