export interface Lead {
  id?: number;
  saleId?: number;
  agentId: number;
  customerName: string;
  customerPhone?: string;
  policyId?: number;
  policyName?: string;
  quotedAmount?: number;
  premiumAmount?: number;
  status: string;
  notes?: string;
  createdDate?: string;
  createdAt?: string;
}

export interface Proposal {
  proposalId: number;
  policyName: string;
  sumAssured: number;
  premiumAmount: number;
  status: string;
  createdAt: string;
  customerId: number;
}

export interface CreateLeadRequest {
  customerName: string;
  customerPhone: string;
  quotedAmount: number;
  notes: string;
}

export interface CreateProposalRequest {
  customerId: number;
  policyName: string;
  sumAssured: number;
  premiumAmount: number;
  fundId: number;
}

export interface ApprovalRequest {
  requestId: number;
  requestType: string;
  reason: string;
}

export interface AgentState {
  leads: Lead[];
  proposals: Proposal[];
  policies: Policy[];
  conversionRate: number;
  totalCommission: number;
  loading: boolean;
  error: string | null;
}

export interface Policy {
  policyId: number;
  policyName: string;
  customerName: string;
  status: string;
  premium: number;
  currentValue: number;
  createdAt: string;
}
