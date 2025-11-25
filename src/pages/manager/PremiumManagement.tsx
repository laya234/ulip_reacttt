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
  Alert,
  Snackbar,
  Chip,
  IconButton,
} from '@mui/material';
import { Payment, Send, Refresh } from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';

interface OverduePremium {
  premiumId: number;
  policyId: number;
  policyNumber: string;
  customerName: string;
  premiumAmount: number;
  dueDate: string;
  status: string;
}

export default function PremiumManagement() {
  const [overduePremiums, setOverduePremiums] = useState<OverduePremium[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    fetchOverduePremiums();
  }, []);

  const fetchOverduePremiums = async () => {
    try {
      const response = await fetch('https://localhost:7073/api/premium/overdue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOverduePremiums(data);
      }
    } catch (error) {
      console.error('Failed to fetch overdue premiums:', error);
    } finally {
      setLoading(false);
    }
  };

  const processOverduePolicies = async () => {
    setProcessing(true);
    try {
      const response = await fetch('https://localhost:7073/api/premium/process-overdue', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: 'Overdue policies processed successfully!', 
          severity: 'success' 
        });
        fetchOverduePremiums();
      } else {
        throw new Error('Processing failed');
      }
    } catch {
      setSnackbar({ 
        open: true, 
        message: 'Failed to process overdue policies', 
        severity: 'error' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const sendReminder = async (policyId: number) => {
    try {
      const response = await fetch(`https://localhost:7073/api/premium/${policyId}/send-reminder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: 'Reminder sent successfully!', 
          severity: 'success' 
        });
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch {
      setSnackbar({ 
        open: true, 
        message: 'Failed to send reminder', 
        severity: 'error' 
      });
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <Loader />;

  return (
    <Box p={3}>
      <PageHeader title="Premium Management" icon={<Payment />} />
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={processOverduePolicies}
          disabled={processing}
          startIcon={<Refresh />}
        >
          {processing ? 'Processing...' : 'Process Overdue Policies'}
        </Button>
        <Button
          variant="outlined"
          onClick={fetchOverduePremiums}
          startIcon={<Refresh />}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overdue Premiums ({overduePremiums.length})
        </Typography>
        
        {overduePremiums.length === 0 ? (
          <Alert severity="success">No overdue premiums found!</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Policy Number</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Premium Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Days Overdue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overduePremiums.map((premium) => {
                  const daysOverdue = getDaysOverdue(premium.dueDate);
                  return (
                    <TableRow key={premium.premiumId}>
                      <TableCell>{premium.policyNumber}</TableCell>
                      <TableCell>{premium.customerName}</TableCell>
                      <TableCell>₹{premium.premiumAmount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(premium.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${daysOverdue} days`}
                          color={daysOverdue > 30 ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={premium.status}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => sendReminder(premium.policyId)}
                          title="Send Reminder"
                          size="small"
                        >
                          <Send />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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
