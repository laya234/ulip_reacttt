import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';

interface SurrenderDialogProps {
  open: boolean;
  policyId: number;
  policyNumber: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function SurrenderDialog({
  open,
  policyNumber,
  onClose,
  onSubmit,
}: SurrenderDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) return;
    
    onSubmit(reason.trim());
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Request Policy Surrender
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Policy Number: {policyNumber}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Reason for Surrender"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          error={!reason.trim()}
          helperText={!reason.trim() ? 'Reason is required' : ''}
          sx={{ mb: 3 }}
        />

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Your surrender request will be automatically assigned to an available manager for review.
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!reason.trim()}
        >
          Submit Surrender Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
