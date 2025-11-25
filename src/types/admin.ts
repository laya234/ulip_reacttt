export interface Fund {
  fundId: number;
  fundName: string;
  fundType: 'Equity' | 'Debt' | 'Hybrid';
  navValue: number;
  createdAt: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface CreateFundRequest {
  fundName: string;
  fundType: 'Equity' | 'Debt' | 'Hybrid';
  navValue: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface UpdateNavRequest {
  fundId: number;
  newNAV: number;
}

export interface AdminState {
  funds: Fund[];
  loading: boolean;
  error: string | null;
}
