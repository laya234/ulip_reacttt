import api from './http';
import type { RegisterDto, LoginDto, AuthResponse } from '../types/auth';

export const authApi = {
  register: (data: RegisterDto): Promise<{ data: AuthResponse }> => {
    const formData = new FormData();
    formData.append('Email', data.email);
    formData.append('Password', data.password);
    formData.append('ConfirmPassword', data.confirmPassword);
    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('DateOfBirth', data.dateOfBirth);
    formData.append('Address', data.address);
    formData.append('PanNumber', data.panNumber);
    formData.append('Role', data.role);
    return api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  login: (data: LoginDto): Promise<{ data: AuthResponse }> => {
    const formData = new FormData();
    formData.append('Email', data.email);
    formData.append('Password', data.password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};
