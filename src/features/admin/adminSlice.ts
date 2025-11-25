import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fundApi, type Fund, type CreateFundRequest } from '../../api/fund_api';

interface UpdateNavRequest {
  fundId: number;
  newNAV: number;
}

interface AdminState {
  funds: Fund[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  funds: [],
  loading: false,
  error: null,
};

export const fetchFunds = createAsyncThunk('admin/fetchFunds', async () => {
  const response = await fundApi.getFunds();
  return response.data;
});

export const createFund = createAsyncThunk('admin/createFund', async (data: CreateFundRequest) => {
  const response = await fundApi.createFund(data);
  return response.data;
});

export const updateNav = createAsyncThunk('admin/updateNav', async (data: UpdateNavRequest) => {
  const response = await fundApi.updateNav(data.fundId, data.newNAV);
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = action.payload;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch funds';
      })
      .addCase(createFund.fulfilled, () => {
      })
      .addCase(updateNav.fulfilled, () => {
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
