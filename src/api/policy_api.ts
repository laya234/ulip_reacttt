import api from './http';
import type { Transaction } from './transaction_api';

export interface Policy {
  policyId: number;
  id?: number; 
  policyNumber: string;
  policyName: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: string;
  policyStartDate: string;
  policyMaturityDate: string;
  policyStatus: string;
  status?: string; 
  currentValue?: number;
}

export interface PendingProposal {
  id: number;
  policyId: number;
  policyName: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: string;
  agentName: string;
  createdDate: string;
}

export interface AcceptProposalRequest {
  accepted: boolean;
  requireDocuments?: boolean;
  rejectionReason?: string;
}

export interface SurrenderRequest {
  reason: string;
  managerId?: number;
}

export const policyApi = {
  getPendingProposals: (): Promise<{ data: PendingProposal[] }> =>
    api.get('/policy/pending-proposals'),

  acceptProposal: (data: AcceptProposalRequest & { policyId: number }): Promise<{ data: { success: boolean } }> =>
    api.post('/policy/accept', data),

  getMyPolicies: (): Promise<{ data: Policy[] }> =>
    api.get('/policy/my-policies'),

  getPolicyById: (data: { policyId: number }): Promise<{ data: Policy }> =>
    api.post('/policy/details', data),

  getSurrenderValue: (data: { policyId: number }): Promise<{ data: { surrenderValue: number } }> =>
    api.post('/policy/surrender-value', data),

  requestSurrender: (data: SurrenderRequest & { policyId: number }): Promise<{ data: { success: boolean } }> =>
    api.post('/policy/surrender', data),

  getCompleteDetails: (data: { policyId: number }): Promise<{ data: { policy: Policy; surrenderValue: number; transactions: Transaction[] } }> =>
    api.post('/policy/complete-details', data),
};
