import api from './http';

export interface PayPremiumRequest {
  policyId: number;
  premiumAmount: number;
  paymentMethod: string;
  fundId: number;
  dueDate: string;
}

export const premiumApi = {
  payPremium: (data: PayPremiumRequest): Promise<{ data: { success: boolean } }> => {
    console.log('Premium API received data:', data);
    const formData = new FormData();
    formData.append('PolicyId', data.policyId.toString());
    formData.append('FundId', data.fundId.toString());
    formData.append('PremiumAmount', data.premiumAmount.toString());
    formData.append('DueDate', data.dueDate);
    formData.append('PaymentMethod', data.paymentMethod);
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    return api.post('/premium/pay', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};
