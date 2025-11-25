import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserState, UpdateProfileRequest } from '../../types/user';
import { userApi } from '../../api/user_api';

const initialState: UserState = {
  users: [],
  profile: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await userApi.getAllUsers();
  return response.data;
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await userApi.getProfile();
  return response.data;
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data: UpdateProfileRequest) => {
  const response = await userApi.updateProfile(data);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
