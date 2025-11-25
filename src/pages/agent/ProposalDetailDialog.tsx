import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import type { Lead } from '../../types/agent';

interface ProposalDetailDialogProps {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSendForApproval: (leadId: number, reason: string) => Promise<void>;
}

export default function ProposalDetailDialog({ 
  open, 
  lead, 
  onClose, 
  onSendForApproval 
}: ProposalDetailDialogProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendForApproval = async () => {
    if (!lead || !reason.trim()) return;

    setLoading(true);
    try {
      await onSendForApproval(lead.id || lead.saleId || 0, reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Failed to send for approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Lead Details - {lead.customerName}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Lead ID
              </Typography>
              <Typography variant="body1">{lead.id || lead.saleId}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body1">{lead.status}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Phone
              </Typography>
              <Typography variant="body1">{lead.customerPhone || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Quoted Amount
              </Typography>
              <Typography variant="body1">
                {lead.quotedAmount ? `₹${lead.quotedAmount.toLocaleString()}` : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Created Date
              </Typography>
              <Typography variant="body1">
                {lead.createdDate ? new Date(lead.createdDate).toLocaleDateString() : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Notes
              </Typography>
              <Typography variant="body1">{lead.notes || '-'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Send for Approval</Typography>
          <TextField
            label="Reason for Approval"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for sending this lead for approval..."
            fullWidth
            required
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
          Close
        </Button>
        <Button
          onClick={handleSendForApproval}
          variant="contained"
          startIcon={<Send />}
          disabled={loading || !reason.trim()}
        >
          {loading ? 'Sending...' : 'Send for Approval'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
