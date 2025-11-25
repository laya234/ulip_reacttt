import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { CheckCircle, Cancel, Info } from '@mui/icons-material';
import { useState } from 'react';
import { type Approval } from '../../api/manager_api';
import ConfirmDialog from '../../components/ConfirmDialog';

interface ApprovalDetailDialogProps {
  open: boolean;
  approval: Approval | null;
  onClose: () => void;
  onApprove: (id: number, comments?: string) => void;
  onReject: (id: number, comments: string) => void;
}

export default function ApprovalDetailDialog({
  open,
  approval,
  onClose,
  onApprove,
  onReject,
}: ApprovalDetailDialogProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
  }>({ open: false, type: 'approve' });

  if (!approval) return null;

  const handleApprove = () => {
    setConfirmDialog({ open: true, type: 'approve' });
  };

  const handleReject = () => {
    setConfirmDialog({ open: true, type: 'reject' });
  };

  const handleConfirmAction = (comments?: string) => {
    if (confirmDialog.type === 'approve') {
      onApprove(approval.approvalId, comments);
    } else {
      onReject(approval.approvalId, comments || '');
    }
    setConfirmDialog({ open: false, type: 'approve' });
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Info color="primary" />
            Approval Request Details
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Request Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Request ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  #{approval.approvalId}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Request Type
                </Typography>
                <Chip label={approval.requestType} color="primary" size="small" />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Status
                </Typography>
                <Chip 
                  label={approval.status || 'Pending'} 
                  color={approval.status === 'Approved' ? 'success' : approval.status === 'Rejected' ? 'error' : 'warning'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(approval.amount || 0)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Related Policy ID
                </Typography>
                <Typography variant="body1">
                  #{approval.requestId}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Requester Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {approval.requestedByName || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  Not available
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  User ID
                </Typography>
                <Typography variant="body1">
                  #{approval.requestedBy}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Request Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(approval.requestedAt)}
                </Typography>
              </Box>
            </Grid>
            
            {approval.requestReason && (
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">
                    {approval.requestReason}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          {approval.status === 'Pending' && (
            <>
              <Button
                onClick={handleReject}
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        message={
          confirmDialog.type === 'approve'
            ? `Are you sure you want to approve this ${approval.requestType} request for ${formatCurrency(approval.amount || 0)}?`
            : `Are you sure you want to reject this ${approval.requestType} request? Please provide a reason.`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, type: 'approve' })}
        confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
        requireComments={confirmDialog.type === 'reject'}
        commentsLabel={confirmDialog.type === 'approve' ? 'Comments (Optional)' : 'Rejection Reason'}
        severity={confirmDialog.type === 'approve' ? 'success' : 'error'}
      />
    </>
  );
}
