import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { policyApi, type Policy, type PendingProposal } from '../../api/policy_api';
import { premiumApi, type PayPremiumRequest } from '../../api/premium_api';
import { transactionApi, type InvestRequest, type FundSwitchRequest, type Transaction } from '../../api/transaction_api';

interface Fund {
  fundId: number;
  fundName: string;
  fundType: string;
  riskLevel: string;
  currentNAV: number;
  expenseRatio: number;
}

interface CustomerState {
  pendingProposals: PendingProposal[];
  policies: Policy[];
  currentPolicy: Policy | null;
  transactions: Transaction[];
  surrenderValue: number | null;
  funds: Fund[];
  loading: boolean;
  error: string | null;
  lastInvestmentRequiresApproval: boolean;
  lastTransactionId: number | null;
}

const initialState: CustomerState = {
  pendingProposals: [],
  policies: [],
  currentPolicy: null,
  transactions: [],
  surrenderValue: null,
  funds: [],
  loading: false,
  error: null,
  lastInvestmentRequiresApproval: false,
  lastTransactionId: null,
};

export const fetchPendingProposals = createAsyncThunk(
  'customer/fetchPendingProposals',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching pending proposals...');
      const response = await policyApi.getPendingProposals();
      console.log('Pending proposals fetched:', response.data?.length || 0);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching pending proposals:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Unknown error');
    }
  }
);

export const acceptProposal = createAsyncThunk(
  'customer/acceptProposal',
  async ({ proposalId, accepted }: { proposalId: number; accepted: boolean }) => {
    const response = await policyApi.acceptProposal({ policyId: proposalId, accepted, requireDocuments: false });
    return response.data;
  }
);

export const rejectProposal = createAsyncThunk(
  'customer/rejectProposal',
  async ({ proposalId, accepted, rejectionReason }: { proposalId: number; accepted: boolean; rejectionReason: string }) => {
    const response = await policyApi.acceptProposal({ policyId: proposalId, accepted, requireDocuments: false, rejectionReason });
    return response.data;
  }
);

export const fetchMyPolicies = createAsyncThunk(
  'customer/fetchMyPolicies',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching my policies...');
      const response = await policyApi.getMyPolicies();
      console.log('My policies fetched:', response.data?.length || 0);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching my policies:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Unknown error');
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'customer/fetchPolicyById',
  async (policyId: number) => {
    const response = await policyApi.getPolicyById({ policyId });
    return response.data;
  }
);

export const fetchSurrenderValue = createAsyncThunk(
  'customer/fetchSurrenderValue',
  async (policyId: number) => {
    const response = await policyApi.getSurrenderValue({ policyId });
    return response.data;
  }
);

export const requestSurrender = createAsyncThunk(
  'customer/requestSurrender',
  async ({ policyId, reason, managerId }: { policyId: number; reason: string; managerId?: number }) => {
    const response = await policyApi.requestSurrender({ policyId, reason, managerId });
    return response.data;
  }
);

export const payPremium = createAsyncThunk(
  'customer/payPremium',
  async (data: PayPremiumRequest) => {
    const response = await premiumApi.payPremium(data);
    return response.data;
  }
);

export const invest = createAsyncThunk(
  'customer/invest',
  async (data: InvestRequest) => {
    const response = await transactionApi.invest(data);
    return response.data;
  }
);

export const fundSwitch = createAsyncThunk(
  'customer/fundSwitch',
  async (data: FundSwitchRequest) => {
    const response = await transactionApi.fundSwitch(data);
    return response.data;
  }
);

export const fetchTransactionsByPolicy = createAsyncThunk(
  'customer/fetchTransactionsByPolicy',
  async (policyId: number) => {
    const response = await transactionApi.getTransactionsByPolicy(policyId);
    return response.data;
  }
);

export const requestApproval = createAsyncThunk(
  'customer/requestApproval',
  async (transactionId: number) => {
    const response = await transactionApi.requestApproval(transactionId);
    return response.data;
  }
);

export const fetchCompleteDetails = createAsyncThunk<{
  policy: Policy;
  surrenderValue: number;
  transactions: Transaction[];
  funds: Fund[];
}, number>(
  'customer/fetchCompleteDetails',
  async (policyId: number) => {
    const response = await policyApi.getCompleteDetails({ policyId });
    const data = response.data as { policy?: Policy; Policy?: Policy; surrenderValue?: number; SurrenderValue?: number; transactions?: Transaction[]; Transactions?: Transaction[]; funds?: Fund[]; Funds?: Fund[] };
    console.log('Raw API response:', data);
    console.log('Funds from API:', data.funds, data.Funds);
    return {
      policy: data.policy || data.Policy!,
      surrenderValue: data.surrenderValue || data.SurrenderValue || 0,
      transactions: data.transactions || data.Transactions || [],
      funds: data.funds || data.Funds || []
    };
  }
);



const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearApprovalState: (state) => {
      state.lastInvestmentRequiresApproval = false;
      state.lastTransactionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingProposals = action.payload;
      })
      .addCase(fetchPendingProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pending proposals';
      })
      .addCase(acceptProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptProposal.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(acceptProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to accept proposal';
      })
      .addCase(fetchMyPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload;
      })
      .addCase(fetchMyPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch policies';
      })
      .addCase(fetchPolicyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPolicy = action.payload;
      })
      .addCase(fetchPolicyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch policy details';
      })
      .addCase(fetchSurrenderValue.fulfilled, (state, action) => {
        state.surrenderValue = action.payload.surrenderValue;
      })
      .addCase(fetchTransactionsByPolicy.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(payPremium.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payPremium.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(payPremium.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process premium payment';
      })
      .addCase(invest.fulfilled, (state, action) => {
        state.loading = false;
        state.lastInvestmentRequiresApproval = action.payload.requiresApproval || false;
        state.lastTransactionId = action.payload.transactionId || null;
      })
      .addCase(fundSwitch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchCompleteDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompleteDetails.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Complete details response:', action.payload);
        state.currentPolicy = action.payload.policy;
        state.surrenderValue = action.payload.surrenderValue;
        state.transactions = action.payload.transactions;
        state.funds = action.payload.funds || [];
        console.log('Funds stored in state:', state.funds);
      })
      .addCase(fetchCompleteDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch policy details';
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: { error?: { message?: string } }) => {
          state.loading = false;
          state.error = action.error?.message || 'An error occurred';
        }
      );
  },
});

export const { clearError, clearApprovalState } = customerSlice.actions;
export default customerSlice.reducer;
