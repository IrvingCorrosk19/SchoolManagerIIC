// Define types for school management

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  status: 'active' | 'inactive';
  modules: {
    grades: boolean;
    parents: boolean;
    admin: boolean;
    director: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolAdmin {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: 'admin' | 'director';
  tempPassword: string;
  passwordChanged: boolean;
  twoFactorEnabled: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  schoolId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'password_change' | 'enable_2fa';
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
  preventReuse: number;
}

export interface SuperAdminSettings {
  id: string;
  passwordPolicy: PasswordPolicy;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  updatedAt: Date;
}