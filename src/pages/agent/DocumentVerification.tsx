import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip,
  IconButton,
} from '@mui/material';
import { VerifiedUser, Cancel, Visibility } from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';

interface PendingPolicy {
  policyId: number;
  policyNumber: string;
  policyName: string;
  customerName: string;
  sumAssured: number;
  kycVerified: boolean;
  medicalVerified: boolean;
  uploadedDocuments: string[];
  policyStatus: string;
}

export default function DocumentVerification() {
  const [policies, setPolicies] = useState<PendingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyDialog, setVerifyDialog] = useState<{
    open: boolean;
    policyId: number;
    documentType: string;
  }>({ open: false, policyId: 0, documentType: '' });
  const [comments, setComments] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    fetchPendingPolicies();
  }, []);

  const fetchPendingPolicies = async () => {
    try {
      const response = await fetch('https://localhost:7073/api/policy/pending-verification', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched policies:', data);
        setPolicies(data);
      } else {
        console.error('Failed to fetch policies:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch pending policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (approved: boolean) => {
    try {
      const response = await fetch(
        `https://localhost:7073/api/policy/${verifyDialog.policyId}/verify-documents?documentType=${verifyDialog.documentType}&approved=${approved}&comments=${encodeURIComponent(comments)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: `Document ${approved ? 'approved' : 'rejected'} successfully!`, 
          severity: 'success' 
        });
        setVerifyDialog({ open: false, policyId: 0, documentType: '' });
        setComments('');
        fetchPendingPolicies();
      } else {
        throw new Error('Verification failed');
      }
    } catch {
      setSnackbar({ 
        open: true, 
        message: 'Failed to verify document', 
        severity: 'error' 
      });
    }
  };

  const openVerifyDialog = (policyId: number, documentType: string) => {
    setVerifyDialog({ open: true, policyId, documentType });
  };

  if (loading) return <Loader />;

  console.log('Component state - policies:', policies, 'loading:', loading);

  return (
    <Box p={3}>
      <PageHeader title="Document Verification" icon={<VerifiedUser />} />
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Policies Pending Document Verification
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Policy Number</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Sum Assured</TableCell>
                <TableCell>KYC Status</TableCell>
                <TableCell>Medical Status</TableCell>
                <TableCell>Uploaded Documents</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No policies with uploaded documents found
                  </TableCell>
                </TableRow>
              )}
              {policies.map((policy) => (
                <TableRow key={policy.policyId}>
                  <TableCell>{policy.policyNumber}</TableCell>
                  <TableCell>{policy.customerName}</TableCell>
                  <TableCell>₹{policy.sumAssured.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={policy.kycVerified ? 'Verified' : 'Pending'} 
                      color={policy.kycVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={policy.medicalVerified ? 'Verified' : 'Pending'} 
                      color={policy.medicalVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {policy.uploadedDocuments.map((doc) => (
                        <Chip 
                          key={doc}
                          label={doc}
                          size="small"
                          variant="outlined"
                          onClick={() => openVerifyDialog(policy.policyId, doc)}
                          clickable
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {policy.uploadedDocuments.map((doc) => (
                        <IconButton 
                          key={doc}
                          onClick={() => {
                            const token = localStorage.getItem('auth_token');
                            fetch(`https://localhost:7073/api/policy/${policy.policyId}/download-document/${doc}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            })
                            .then(response => response.blob())
                            .then(blob => {
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            })
                            .catch(err => console.error('Download failed:', err));
                          }}
                          title={`View ${doc}`}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Verification Dialog */}
      <Dialog open={verifyDialog.open} onClose={() => setVerifyDialog({ open: false, policyId: 0, documentType: '' })}>
        <DialogTitle>Verify Document: {verifyDialog.documentType}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comments (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialog({ open: false, policyId: 0, documentType: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleVerifyDocument(false)} 
            color="error"
            startIcon={<Cancel />}
          >
            Reject
          </Button>
          <Button 
            onClick={() => handleVerifyDocument(true)} 
            color="success"
            startIcon={<VerifiedUser />}
          >
            Approve
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
