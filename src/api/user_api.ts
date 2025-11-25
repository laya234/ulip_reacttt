import api from './http';
import type { User, UserProfile, UpdateProfileRequest } from '../types/user';

export const userApi = {
  getProfile: (): Promise<{ data: UserProfile }> =>
    api.get('/user/profile'),

  updateProfile: (data: UpdateProfileRequest): Promise<{ data: UserProfile }> => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof UpdateProfileRequest]);
    });
    
    return api.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getCommission: (): Promise<{ data: { totalCommission: number } }> =>
    api.get('/user/commission'),

  getAllUsers: (): Promise<{ data: User[] }> =>
    api.get('/user'),
};
