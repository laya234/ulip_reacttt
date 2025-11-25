import api from './http';

export interface Approval {
  approvalId: number;
  requestId: number;
  requestType: string;
  requestedBy: number;
  requestedByName?: string;
  amount?: number;
  status: string;
  requestedAt: string;
  requestReason?: string;
  approvalComments?: string;
}

export interface OverduePremium {
  policyId: number;
  holderName: string;
  dueAmount: number;
  dueDate: string;
  daysOverdue: number;
  contact: string;
  policyNumber?: string;
}

export interface ApprovalActionRequest {
  comments?: string;
}

export interface Manager {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const managerApi = {
  getPendingApprovals: () => api.get<Approval[]>('/approval/pending'),
  
  approveRequest: (id: number, data: ApprovalActionRequest) => {
    const formData = new FormData();
    formData.append('comments', data.comments || '');
    return api.post(`/approval/${id}/approve`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  rejectRequest: (id: number, data: ApprovalActionRequest) => {
    const formData = new FormData();
    formData.append('comments', data.comments || '');
    return api.post(`/approval/${id}/reject`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getOverduePremiums: () => api.get<OverduePremium[]>('/premium/overdue'),
  
  sendPremiumReminder: (policyId: number) => 
    api.post(`/premium/${policyId}/send-reminder`),
  
  getManagers: () => api.get<Manager[]>('/user/all?role=Manager'),
};
