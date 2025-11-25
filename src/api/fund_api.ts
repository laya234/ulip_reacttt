import api from './http';

export interface Fund {
  fundId: number;
  fundName: string;
  fundType: string;
  currentNAV: number;
  riskLevel: string;
  expenseRatio?: number;
  description?: string;
  updatedAt?: string;
}

export interface CreateFundRequest {
  fundName: string;
  fundType: string;
  currentNAV: number;
  expenseRatio: number;
  riskLevel: string;
  description: string;
}

export const fundApi = {
  getFunds: (): Promise<{ data: Fund[] }> =>
    api.get('/fund'),
    
  getAvailableFunds: (): Promise<{ data: Fund[] }> =>
    api.get('/fund'),
    
  createFund: (data: CreateFundRequest): Promise<{ data: Fund }> => {
    const formData = new FormData();
    formData.append('fundName', data.fundName);
    formData.append('fundType', data.fundType);
    formData.append('currentNAV', data.currentNAV.toString());
    formData.append('expenseRatio', data.expenseRatio.toString());
    formData.append('riskLevel', data.riskLevel);
    formData.append('description', data.description || '');
    return api.post('/fund', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
    
  updateNav: (fundId: number, newNAV: number): Promise<{ data: Fund }> => {
    const formData = new FormData();
    formData.append('newNAV', newNAV.toString());
    return api.post(`/fund/${fundId}/update-nav`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const getFunds = fundApi.getFunds;
export const getAvailableFunds = fundApi.getAvailableFunds;
export const createFund = fundApi.createFund;
export const updateNav = fundApi.updateNav;
