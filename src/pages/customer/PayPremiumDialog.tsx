import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch } from '../../store';
import { payPremium } from '../../features/customer/customerSlice';
import { fundApi, type Fund } from '../../api/fund_api';

interface Policy {
  policyId?: number;
  id?: number;
  policyName: string;
  policyNumber: string;
  premiumAmount?: number;
}

interface PayPremiumDialogProps {
  open: boolean;
  policy: Policy;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const paymentMethods = [
  { value: 'Online', label: 'Online' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Cash', label: 'Cash' },
  { value: 'AutoDebit', label: 'Auto Debit' },
];

export default function PayPremiumDialog({ open, policy, onClose, onSuccess, onError }: PayPremiumDialogProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [formData, setFormData] = useState({
    premiumAmount: '',
    paymentMethod: 'Online',
    fundId: '',
  });

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fundApi.getAvailableFunds();
        setFunds(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, fundId: response.data[0].fundId.toString() }));
        }
      } catch (error) {
        console.error('Failed to fetch funds:', error);
      }
    };
    
    if (open) {
      fetchFunds();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;

    const policyId = policy.policyId || policy.id;
    if (!policyId) {
      onError('Policy ID is required');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        policyId,
        premiumAmount: parseFloat(formData.premiumAmount),
        paymentMethod: formData.paymentMethod,
        fundId: parseInt(formData.fundId),
        dueDate: new Date().toISOString(),
      };
      console.log('Sending premium payment data:', paymentData);
      await dispatch(payPremium(paymentData)).unwrap();
      
      onSuccess('Premium payment successful!');
      onClose();
      setFormData({ premiumAmount: '', paymentMethod: 'Online', fundId: funds.length > 0 ? funds[0].fundId.toString() : '' });
    } catch (err: unknown) {
      console.error('Premium payment error:', err);
      onError((err as Error)?.message || 'Failed to process premium payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ premiumAmount: '', paymentMethod: 'Online', fundId: funds.length > 0 ? funds[0].fundId.toString() : '' });
    }
  };

  if (!policy) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay Premium - {policy.policyName}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
            Policy Number: {policy.policyNumber}
          </Typography>
          <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
            Regular Premium: ₹{policy.premiumAmount?.toLocaleString()}
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Premium Amount"
            type="number"
            value={formData.premiumAmount}
            onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Enter the amount you want to pay"
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#60a5fa' },
                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
              },
              '& .MuiInputBase-input': { color: '#e2e8f0' },
              '& .MuiFormHelperText-root': { color: '#94a3b8' }
            }}
          />
          
          <TextField
            label="Payment Method"
            select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            required
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#60a5fa' },
                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
              },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Investment Fund"
            select
            value={formData.fundId}
            onChange={(e) => setFormData({ ...formData, fundId: e.target.value })}
            required
            fullWidth
            helperText="Select fund for premium investment"
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#60a5fa' },
                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
              },
              '& .MuiInputBase-input': { color: '#e2e8f0' },
              '& .MuiFormHelperText-root': { color: '#94a3b8' }
            }}
          >
            {funds.map((fund) => (
              <MenuItem key={fund.fundId} value={fund.fundId.toString()}>
                {fund.fundName} - NAV: ₹{fund.currentNAV} ({fund.riskLevel} Risk)
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={loading}
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
          disabled={loading || !formData.premiumAmount}
        >
          {loading ? <CircularProgress size={20} /> : 'Pay Premium'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
