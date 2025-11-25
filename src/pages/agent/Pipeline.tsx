import { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Assessment, Visibility, Send } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchPipeline, createLead, submitApprovalRequest, createPolicyProposal } from '../../features/agent/agentSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import SeverityChip from '../../components/SeverityChip';
import CreateLeadDialog from './CreateLeadDialog';
import ProposalDetailDialog from './ProposalDetailDialog';
import CreateProposalDialog from './CreateProposalDialog';
import type { CreateLeadRequest, Lead } from '../../types/agent';

export default function Pipeline() {
  const dispatch = useAppDispatch();
  const { leads, loading, error } = useAppSelector((state) => state.agent);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [leadDialog, setLeadDialog] = useState(false);
  const [proposalDialog, setProposalDialog] = useState<{ open: boolean; lead: Lead | null }>({
    open: false,
    lead: null,
  });
  const [createProposalDialog, setCreateProposalDialog] = useState<{ open: boolean; lead: Lead | null }>({
    open: false,
    lead: null
  });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    dispatch(fetchPipeline());
  }, [dispatch]);

  const filteredLeads = leads.filter(lead =>
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.customerPhone && lead.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateLead = async (data: CreateLeadRequest) => {
    try {
      console.log('Sending lead data:', data);
      const result = await dispatch(createLead(data)).unwrap();
      console.log('Lead created successfully:', result);
      dispatch(fetchPipeline());
      setSnackbar({ open: true, message: 'Lead created successfully!', severity: 'success' });
    } catch (error: unknown) {
      const err = error as Error & { response?: { status?: number; data?: string } };
      console.error('Create lead error details:', {
        error,
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      
      let errorMessage = 'Failed to create lead';
      if (err?.response?.status === 500) {
        const responseText = err?.response?.data || err?.message || '';
        if (responseText.includes('Lead already exists')) {
          errorMessage = 'Lead already exists for this customer';
        } else if (responseText.includes('ArgumentException')) {
          errorMessage = 'Invalid data provided';
        } else {
          errorMessage = 'Server error occurred';
        }
      } else {
        errorMessage = (err?.response?.data as string) || err?.message || 'Failed to create lead';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      throw new Error(errorMessage);
    }
  };

  const handleSendForApproval = async (leadId: number, reason: string) => {
    try {
      await dispatch(submitApprovalRequest({
        requestId: leadId,
        requestType: 'LeadApproval',
        reason,
      })).unwrap();
      setSnackbar({ open: true, message: 'Sent for approval successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to send for approval', severity: 'error' });
      throw new Error('Failed to send for approval');
    }
  };

  const handleCreateProposal = async (data: {
    customerId: number;
    policyName: string;
    sumAssured: number;
    premiumAmount: number;
    premiumFrequency: string;
    policyStartDate: string;
    policyMaturityDate: string;
  }) => {
    try {
      console.log('Creating proposal with data:', data);
      await dispatch(createPolicyProposal(data)).unwrap();
      dispatch(fetchPipeline());
      setSnackbar({ open: true, message: 'Proposal created successfully!', severity: 'success' });
    } catch (error: unknown) {
      console.error('Create proposal error:', error);
      setSnackbar({ open: true, message: 'Failed to create proposal', severity: 'error' });
      throw new Error('Failed to create proposal');
    }
  };

  const handleViewProposal = (lead: Lead) => {
    setProposalDialog({ open: true, lead });
  };



  if (loading) return <Loader />;

  return (
    <Box p={3}>
      <PageHeader title="Sales Pipeline" icon={<Assessment />} />
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search leads..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Quoted Amount</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id || lead.saleId}>
                <TableCell>{lead.id}</TableCell>
                <TableCell>{lead.customerName}</TableCell>
                <TableCell>{lead.customerPhone}</TableCell>
                <TableCell>{lead.quotedAmount ? `₹${lead.quotedAmount.toLocaleString()}` : '-'}</TableCell>
                <TableCell>{lead.createdDate ? new Date(lead.createdDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <SeverityChip 
                    severity={lead.status === 'Converted' ? 'success' : lead.status === 'Rejected' ? 'error' : 'info'}
                    label={lead.status}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewProposal(lead)}>
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    onClick={() => setCreateProposalDialog({ open: true, lead })}
                    disabled={lead.status === 'Converted'}
                  >
                    <Send />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setLeadDialog(true)}
      >
        <Add />
      </Fab>

      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setCreateProposalDialog({ open: true, lead: null })}
      >
        <Send />
      </Fab>

      <CreateLeadDialog
        open={leadDialog}
        onClose={() => setLeadDialog(false)}
        onSubmit={handleCreateLead}
      />

      <ProposalDetailDialog
        open={proposalDialog.open}
        lead={proposalDialog.lead}
        onClose={() => setProposalDialog({ open: false, lead: null })}
        onSendForApproval={handleSendForApproval}
      />

      <CreateProposalDialog
        open={createProposalDialog.open}
        onClose={() => setCreateProposalDialog({ open: false, lead: null })}
        onSubmit={handleCreateProposal}
        selectedLead={createProposalDialog.lead ? {
          customerName: createProposalDialog.lead.customerName,
          customerPhone: createProposalDialog.lead.customerPhone || ''
        } : null}
      />

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
