import api from './http';
import type { Lead, CreateLeadRequest, ApprovalRequest } from '../types/agent';

export const agentApi = {
  getPipeline: (): Promise<{ data: Lead[] }> =>
    api.get('/sale/my-pipeline'),

  getConversionRate: (): Promise<{ data: { conversionRate: number } }> =>
    api.get('/sale/conversion-rate'),

  createLead: (data: CreateLeadRequest): Promise<{ data: Lead }> => {
    const formData = new FormData();
    formData.append('CustomerName', data.customerName);
    formData.append('CustomerPhone', data.customerPhone);
    formData.append('QuotedAmount', data.quotedAmount.toString());
    formData.append('Notes', data.notes);
    
    return api.post('/sale/lead', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  convertLead: (saleId: number, policyData: Record<string, unknown>): Promise<{ data: { success: boolean } }> => {
    const formData = new FormData();
    Object.keys(policyData).forEach(key => {
      formData.append(key, String(policyData[key]));
    });
    return api.post(`/sale/${saleId}/convert`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAgentPolicies: (): Promise<{ data: unknown[] }> =>
    api.get('/policy/agent-policies'),

  createPolicyProposal: (data: { customerId: number; policyName: string; sumAssured: number; premiumAmount: number; premiumFrequency: string; policyStartDate: string; policyMaturityDate: string }): Promise<{ data: unknown }> => {
    const formData = new FormData();
    formData.append('CustomerId', data.customerId.toString());
    formData.append('PolicyName', data.policyName);
    formData.append('SumAssured', data.sumAssured.toString());
    formData.append('PremiumAmount', data.premiumAmount.toString());
    formData.append('PremiumFrequency', data.premiumFrequency);
    formData.append('PolicyStartDate', data.policyStartDate);
    formData.append('PolicyMaturityDate', data.policyMaturityDate);
    
    return api.post('/Policy/create-proposal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  sendPremiumReminder: (policyId: number): Promise<{ data: { success: boolean } }> =>
    api.post(`/premium/${policyId}/send-reminder`),

  submitApprovalRequest: (data: ApprovalRequest): Promise<{ data: { success: boolean } }> => {
    const formData = new FormData();
    formData.append('RequestId', data.requestId.toString());
    formData.append('RequestType', data.requestType);
    formData.append('Reason', data.reason);
    
    return api.post('/Approval/request', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getCommission: (): Promise<{ data: { totalCommission: number } }> =>
    api.get('/user/commission'),

  getDashboardData: (): Promise<{ data: { pipeline: Lead[]; conversionRate: number; totalCommission: number } }> =>
    api.get('/sale/dashboard-data'),
};
