import api from './http';

export interface InvestRequest {
  policyId: number;
  amount: number;
  fundId: number;
}

export interface FundSwitchRequest {
  policyId: number;
  fromFundId: number;
  toFundId: number;
  amount: number;
}

export interface Transaction {
  transactionId: number;
  id?: number; 
  policyId: number;
  transactionType: string;
  type?: string; 
  amount: number;
  transactionDate: string;
  date?: string; 
  status?: string;
  fundName?: string;
}

export interface InvestResponse {
  success: boolean;
  transactionId?: number;
  requiresApproval?: boolean;
}

export const transactionApi = {
  invest: (data: InvestRequest): Promise<{ data: InvestResponse }> => {
    const formData = new FormData();
    formData.append('policyId', data.policyId.toString());
    formData.append('amount', data.amount.toString());
    formData.append('fundId', data.fundId.toString());
    return api.post('/transaction/invest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  fundSwitch: (data: FundSwitchRequest): Promise<{ data: { success: boolean } }> => {
    const formData = new FormData();
    formData.append('policyId', data.policyId.toString());
    formData.append('fromFundId', data.fromFundId.toString());
    formData.append('toFundId', data.toFundId.toString());
    formData.append('amount', data.amount.toString());
    return api.post('/transaction/fund-switch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getTransactionsByPolicy: (policyId: number): Promise<{ data: Transaction[] }> =>
    api.get(`/transaction/by-policy/${policyId}/transactions`),

  requestApproval: (transactionId: number): Promise<{ data: { success: boolean } }> =>
    api.post(`/transaction/${transactionId}/request-approval`),
};
