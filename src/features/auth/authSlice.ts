import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/auth';

const initialState: AuthState = {
  token: localStorage.getItem('auth_token'),
  user: (() => {
    const userData = localStorage.getItem('auth_user');
    return userData && userData !== 'undefined' ? JSON.parse(userData) : null;
  })(),
  expiresAt: localStorage.getItem('auth_expires'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ token: string; user: User; expiresAt?: string }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.expiresAt = action.payload.expiresAt || null;
      state.error = null;
      
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      if (action.payload.expiresAt) {
        localStorage.setItem('auth_expires', action.payload.expiresAt);
      }
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.expiresAt = null;
      state.loading = false;
      state.error = null;
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_expires');
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;
