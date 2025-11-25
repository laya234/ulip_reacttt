
import { useState, useCallback } from 'react';
import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,

} from '@mui/material';

import api from '../../api/http';

interface CreateProposalRequest {
  customerId: number;
  policyName: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: string;
  policyStartDate: string;
  policyMaturityDate: string;
}

interface CreateProposalDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProposalRequest) => Promise<void>;
  selectedLead?: { customerName: string; customerPhone: string } | null;
}

export default function CreateProposalDialog({ open, onClose, onSubmit, selectedLead }: CreateProposalDialogProps) {
  const [formData, setFormData] = useState<CreateProposalRequest>({
    customerId: 1,
    policyName: '',
    sumAssured: 0,
    premiumAmount: 0,
    premiumFrequency: 'Monthly',
    policyStartDate: '',
    policyMaturityDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerLookup, setCustomerLookup] = useState<{ loading: boolean; customer: { userId: number } | null; error: string | null }>({
    loading: false,
    customer: null,
    error: null
  });



  const handleSubmit = async () => {
    if (!formData.policyName || !formData.sumAssured || !formData.premiumAmount || !formData.policyStartDate || !formData.policyMaturityDate) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to create proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customerId: 1,
      policyName: '',
      sumAssured: 0,
      premiumAmount: 0,
      premiumFrequency: 'Monthly',
      policyStartDate: '',
      policyMaturityDate: '',
    });
    setPhoneNumber('');
    setCustomerLookup({ loading: false, customer: null, error: null });
    onClose();
  };

  const handlePhoneLookup = useCallback(async (phone?: string) => {
    const phoneToLookup = phone || phoneNumber;
    if (!phoneToLookup || phoneToLookup.length < 10) {
      setCustomerLookup({ loading: false, customer: null, error: 'Please enter a valid phone number' });
      return;
    }

    setCustomerLookup({ loading: true, customer: null, error: null });
    try {
      const response = await api.post('/user/customer-lookup', { phoneNumber: phoneToLookup });
      const customer = response.data;
      setCustomerLookup({ loading: false, customer, error: null });
      setFormData(prev => ({ ...prev, customerId: customer.userId }));
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      setCustomerLookup({ 
        loading: false, 
        customer: null, 
        error: err.response?.status === 404 ? 'Customer not found with this phone number' : 'Failed to lookup customer'
      });
    }
  }, [phoneNumber]);

  React.useEffect(() => {
    if (open && selectedLead?.customerPhone) {
      setPhoneNumber(selectedLead.customerPhone);
      handlePhoneLookup(selectedLead.customerPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedLead?.customerPhone]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Policy Proposal</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Customer ID"
            type="number"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
            required
            fullWidth
            disabled={!!customerLookup.customer}
            helperText={customerLookup.customer ? 'Auto-filled' : 'Customer ID will be auto-filled when converting from lead'}
          />
          <TextField
            label="Policy Name"
            value={formData.policyName}
            onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Sum Assured"
            type="number"
            value={formData.sumAssured}
            onChange={(e) => setFormData({ ...formData, sumAssured: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Premium Amount"
            type="number"
            value={formData.premiumAmount}
            onChange={(e) => setFormData({ ...formData, premiumAmount: Number(e.target.value) })}
            required
            fullWidth
          />
          <FormControl required fullWidth>
            <InputLabel>Premium Frequency</InputLabel>
            <Select
              value={formData.premiumFrequency}
              onChange={(e) => setFormData({ ...formData, premiumFrequency: e.target.value })}
            >
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
              <MenuItem value="HalfYearly">Half-Yearly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Policy Start Date"
            type="date"
            value={formData.policyStartDate}
            onChange={(e) => setFormData({ ...formData, policyStartDate: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Policy Maturity Date"
            type="date"
            value={formData.policyMaturityDate}
            onChange={(e) => setFormData({ ...formData, policyMaturityDate: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#94a3b8',
            '&:hover': { 
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              color: '#f1f5f9'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Proposal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
