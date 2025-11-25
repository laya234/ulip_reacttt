export interface ApprovalRequest {
  requestId: number;
  requestType: 'Policy' | 'Transaction' | 'Claim';
  requestedBy: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  description?: string;
}

export interface ManagerState {
  approvals: ApprovalRequest[];
  loading: boolean;
  error: string | null;
}
