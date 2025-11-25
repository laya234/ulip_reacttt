import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AgentState, CreateLeadRequest, ApprovalRequest } from '../../types/agent';
import { agentApi } from '../../api/agent_api';

const initialState: AgentState = {
  leads: [],
  proposals: [],
  policies: [],
  conversionRate: 0,
  totalCommission: 0,
  loading: false,
  error: null,
};

export const fetchPipeline = createAsyncThunk('agent/fetchPipeline', async () => {
  const response = await agentApi.getPipeline();
  return response.data;
});

export const fetchConversionRate = createAsyncThunk('agent/fetchConversionRate', async () => {
  const response = await agentApi.getConversionRate();
  return response.data;
});

export const fetchAgentPolicies = createAsyncThunk('agent/fetchAgentPolicies', async () => {
  const response = await agentApi.getAgentPolicies();
  return response.data;
});

export const fetchCommission = createAsyncThunk('agent/fetchCommission', async () => {
  const response = await agentApi.getCommission();
  return response.data;
});

export const fetchDashboardData = createAsyncThunk('agent/fetchDashboardData', async () => {
  const response = await agentApi.getDashboardData();
  return response.data;
});

export const createLead = createAsyncThunk('agent/createLead', async (data: CreateLeadRequest) => {
  const response = await agentApi.createLead(data);
  return response.data;
});

export const convertLead = createAsyncThunk('agent/convertLead', async ({ saleId, policyData }: { saleId: number; policyData: Record<string, unknown> }) => {
  const response = await agentApi.convertLead(saleId, policyData);
  return response.data;
});

export const createPolicyProposal = createAsyncThunk('agent/createPolicyProposal', async (proposalData: { customerId: number; policyName: string; sumAssured: number; premiumAmount: number; premiumFrequency: string; policyStartDate: string; policyMaturityDate: string }) => {
  const response = await agentApi.createPolicyProposal(proposalData);
  return response.data;
});

export const sendPremiumReminder = createAsyncThunk('agent/sendPremiumReminder', async (policyId: number) => {
  const response = await agentApi.sendPremiumReminder(policyId);
  return response.data;
});

export const submitApprovalRequest = createAsyncThunk('agent/submitApprovalRequest', async (data: ApprovalRequest) => {
  const response = await agentApi.submitApprovalRequest(data);
  return response.data;
});

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipeline.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchPipeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pipeline';
      })
      .addCase(fetchConversionRate.fulfilled, (state, action) => {
        state.conversionRate = action.payload.conversionRate;
      })
      .addCase(fetchAgentPolicies.fulfilled, (state, action) => {
        state.policies = action.payload as typeof state.policies;
      })
      .addCase(fetchCommission.fulfilled, (state, action) => {
        state.totalCommission = action.payload.totalCommission;
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.pipeline;
        state.conversionRate = action.payload.conversionRate;
        state.totalCommission = action.payload.totalCommission;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      })
      .addCase(createLead.fulfilled, () => {
      })
      .addCase(convertLead.fulfilled, () => {
      })
      .addCase(createPolicyProposal.fulfilled, () => {
      })
      .addCase(submitApprovalRequest.fulfilled, () => {
      });
  },
});

export const { clearError } = agentSlice.actions;
export default agentSlice.reducer;
