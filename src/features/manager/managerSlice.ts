import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { managerApi, type Approval, type OverduePremium,  } from '../../api/manager_api';

interface ManagerState {
  pending: Approval[];
  overdue: OverduePremium[];
  loading: boolean;
  error: string | null;
}

const initialState: ManagerState = {
  pending: [],
  overdue: [],
  loading: false,
  error: null,
};

export const fetchPendingApprovals = createAsyncThunk(
  'manager/fetchPendingApprovals',
  async () => {
    const response = await managerApi.getPendingApprovals();
    return response.data;
  }
);

export const approveApproval = createAsyncThunk(
  'manager/approveApproval',
  async ({ id, comments }: { id: number; comments?: string }) => {
    const response = await managerApi.approveRequest(id, { comments });
    return { id, ...response.data };
  }
);

export const rejectApproval = createAsyncThunk(
  'manager/rejectApproval',
  async ({ id, comments }: { id: number; comments: string }) => {
    const response = await managerApi.rejectRequest(id, { comments });
    return { id, ...response.data };
  }
);

export const fetchOverduePremiums = createAsyncThunk(
  'manager/fetchOverduePremiums',
  async () => {
    const response = await managerApi.getOverduePremiums();
    return response.data;
  }
);

export const sendPremiumReminder = createAsyncThunk(
  'manager/sendPremiumReminder',
  async (policyId: number) => {
    const response = await managerApi.sendPremiumReminder(policyId);
    return { policyId, ...response.data };
  }
);



const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pending approvals';
      })
      
      .addCase(approveApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = state.pending.filter(item => 
          item.approvalId !== action.payload.id
        );
      })
      .addCase(approveApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to approve request';
      })
      
      .addCase(rejectApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = state.pending.filter(item => 
          item.approvalId !== action.payload.id
        );
      })
      .addCase(rejectApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject request';
      })
      
      .addCase(fetchOverduePremiums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverduePremiums.fulfilled, (state, action) => {
        state.loading = false;
        state.overdue = action.payload;
      })
      .addCase(fetchOverduePremiums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch overdue premiums';
      })
      
      .addCase(sendPremiumReminder.fulfilled, () => {
      })
      

  },
});

export const { clearError } = managerSlice.actions;
export default managerSlice.reducer;
