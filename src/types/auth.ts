export type UserRole = 'Customer' | 'Agent' | 'Manager' | 'Admin';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  panNumber: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  userId?: number;
  role?: string;
  username?: string;
  success?: boolean;
  message?: string;
}
