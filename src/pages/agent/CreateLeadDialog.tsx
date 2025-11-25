import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import type { CreateLeadRequest } from '../../types/agent';

interface CreateLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadRequest) => Promise<void>;
}

export default function CreateLeadDialog({ open, onClose, onSubmit }: CreateLeadDialogProps) {
  const [formData, setFormData] = useState<CreateLeadRequest>({
    customerName: '',
    customerPhone: '',
    quotedAmount: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.quotedAmount) {
      return;
    }

    setLoading(true);
    try {
      console.log('Dialog submitting data:', formData);
      await onSubmit(formData);
      handleClose();
    } catch (error: unknown) {
      console.error('Dialog error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      quotedAmount: 0,
      notes: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Lead</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Customer Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Customer Phone"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Quoted Amount"
            type="number"
            value={formData.quotedAmount}
            onChange={(e) => setFormData({ ...formData, quotedAmount: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
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
          {loading ? 'Creating...' : 'Create Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
