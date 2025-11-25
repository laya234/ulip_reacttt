import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FundState, CreateFundRequest, UpdateNavRequest } from '../../types/fund';
import { fundApi } from '../../api/fund_api';

const initialState: FundState = {
  funds: [],
  loading: false,
  error: null,
};

export const fetchFunds = createAsyncThunk('fund/fetchFunds', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching funds...');
    const response = await fundApi.getFunds();
    console.log('Funds fetched:', response.data?.length || 0);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching funds:', error);
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return rejectWithValue(err.response?.data?.message || err.message || 'Unknown error');
  }
});

export const createFund = createAsyncThunk('fund/createFund', async (data: CreateFundRequest) => {
  const response = await fundApi.createFund(data);
  return response.data;
});

export const updateNav = createAsyncThunk('fund/updateNav', async (data: UpdateNavRequest) => {
  await fundApi.updateNav(data.fundId, data.newNAV);
  return { fundId: data.fundId, newNAV: data.newNAV };
});

const fundSlice = createSlice({
  name: 'fund',
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
        state.funds = action.payload as typeof state.funds;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch funds';
      })
      .addCase(createFund.fulfilled, () => {
      })
      .addCase(updateNav.fulfilled, (state, action) => {
        const { fundId, newNAV } = action.payload;
        const fundIndex = state.funds.findIndex(fund => fund.fundId === fundId);
        if (fundIndex !== -1) {
          state.funds[fundIndex].currentNAV = newNAV;
          state.funds[fundIndex].updatedAt = new Date().toISOString();
        }
      });
  },
});

export const { clearError } = fundSlice.actions;
export default fundSlice.reducer;
