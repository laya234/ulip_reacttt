export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  panNumber: string;
  role: 'Customer' | 'Agent' | 'Manager' | 'Admin';
  totalCommissionEarned: number;
  policiesSold: number;
  createdAt: string;
}

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  panNumber: string;
  role: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export interface UserState {
  users: User[];
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
