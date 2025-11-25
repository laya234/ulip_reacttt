export interface Fund {
  fundId: number;
  fundName: string;
  fundType: 'Equity' | 'Debt' | 'Hybrid';
  currentNAV: number;
  expenseRatio: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  updatedAt: string;
}

export interface CreateFundRequest {
  fundName: string;
  fundType: 'Equity' | 'Debt' | 'Hybrid';
  currentNAV: number;
  expenseRatio: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface UpdateNavRequest {
  fundId: number;
  newNAV: number;
}

export interface FundState {
  funds: Fund[];
  loading: boolean;
  error: string | null;
}
