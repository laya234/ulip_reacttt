import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import { Assignment, CheckCircle, Cancel} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchPendingProposals, acceptProposal, rejectProposal } from '../../features/customer/customerSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import EmptyStateIllustration from '../../components/EmptyStateIllustration';

interface PendingProposal {
  policyId: number;
  policyName: string;
  sumAssured?: number;
  premiumAmount?: number;
  premiumFrequency: string;
}

export default function PendingProposals() {
  const dispatch = useAppDispatch();
  const { pendingProposals, loading, error } = useAppSelector((state) => state.customer);
  
  const [selectedProposal, setSelectedProposal] = useState<PendingProposal | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: 'accept' | 'reject' | null }>({
    open: false,
    action: null
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    dispatch(fetchPendingProposals());
  }, [dispatch]);

  useEffect(() => {
    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchPendingProposals());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  const handleAcceptProposal = async () => {
    if (!selectedProposal) return;
    
    try {
      await dispatch(acceptProposal({ 
        proposalId: selectedProposal.policyId,
        accepted: true 
      })).unwrap();
      setSnackbar({ open: true, message: 'Proposal accepted successfully!', severity: 'success' });
      setActionDialog({ open: false, action: null });
      dispatch(fetchPendingProposals()); // Refresh proposals list
    } catch {
      setSnackbar({ open: true, message: 'Failed to accept proposal', severity: 'error' });
    }
  };

  const handleRejectProposal = async () => {
    if (!selectedProposal || !rejectionReason.trim()) return;
    
    try {
      await dispatch(rejectProposal({ 
        proposalId: selectedProposal.policyId,
        accepted: false,
        rejectionReason: rejectionReason.trim()
      })).unwrap();
      setSnackbar({ open: true, message: 'Proposal rejected', severity: 'success' });
      setActionDialog({ open: false, action: null });
      setRejectionReason('');
      dispatch(fetchPendingProposals()); // Refresh proposals list
    } catch {
      setSnackbar({ open: true, message: 'Failed to reject proposal', severity: 'error' });
    }
  };

  const openActionDialog = (proposal: PendingProposal, action: 'accept' | 'reject') => {
    setSelectedProposal(proposal);
    setActionDialog({ open: true, action });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, action: null });
    setSelectedProposal(null);
    setRejectionReason('');
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <PageHeader 
        title="Pending Proposals" 
        icon={<Assignment />}
        subtitle="Review and respond to policy proposals from your agent"
      />
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {pendingProposals.length === 0 ? (
        <Paper sx={{ borderRadius: 2 }}>
          <EmptyStateIllustration
            icon={<Assignment />}
            title="No Pending Proposals"
            description="You don't have any policy proposals awaiting your review."
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingProposals.map((proposal) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={proposal.policyId}>
              <Card sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'warning.light',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {proposal.policyName}
                    </Typography>
                    <Chip 
                      label="Pending" 
                      color="warning" 
                      size="small"
                      icon={<Assignment />}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Sum Assured:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{proposal.sumAssured?.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Premium Amount:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{proposal.premiumAmount?.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Premium Frequency:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {proposal.premiumFrequency}
                      </Typography>
                    </Box>
                    

                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => openActionDialog(proposal, 'accept')}
                      sx={{ flex: 1 }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => openActionDialog(proposal, 'reject')}
                      sx={{ flex: 1 }}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={closeActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionDialog.action === 'accept' ? 'Accept Proposal' : 'Reject Proposal'}
        </DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{selectedProposal.policyName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sum Assured: ₹{selectedProposal.sumAssured?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Premium: ₹{selectedProposal.premiumAmount?.toLocaleString()} ({selectedProposal.premiumFrequency})
              </Typography>
            </Box>
          )}
          
          {actionDialog.action === 'accept' ? (
            <Alert severity="info">
              By accepting this proposal, you agree to the terms and conditions. 
              Your policy will become active and premium payments will begin.
            </Alert>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please provide a reason for rejecting this proposal.
              </Alert>
              <TextField
                label="Rejection Reason"
                multiline
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                fullWidth
                placeholder="Please explain why you're rejecting this proposal..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Cancel</Button>
          <Button 
            onClick={actionDialog.action === 'accept' ? handleAcceptProposal : handleRejectProposal}
            variant="contained"
            color={actionDialog.action === 'accept' ? 'success' : 'error'}
            disabled={actionDialog.action === 'reject' && !rejectionReason.trim()}
          >
            {actionDialog.action === 'accept' ? 'Accept Proposal' : 'Reject Proposal'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}