import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';

import { Download, Assessment, Refresh } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchTransactionsByPolicy } from '../../features/customer/customerSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';

interface PortfolioData {
  fundHoldings: FundHolding[];
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  returnPercentage: number;
}

interface FundHolding {
  fundId: number;
  fundName: string;
  totalUnits: number;
  totalInvested: number;
  currentNAV: number;
  currentValue: number;
  gainLoss: number;
  returnPercentage: number;
}

export default function FundPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { transactions, currentPolicy, loading } = useAppSelector((state) => state.customer);
  
  const policyFromState = location.state?.policy;
  const policy = policyFromState || currentPolicy;
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    if (!policy) {
      navigate('/customer/policies');
      return;
    }
    
    const policyId = policy.policyId || policy.id;
    if (policyId && transactions.length === 0) {
      dispatch(fetchTransactionsByPolicy(policyId));
    }
  }, [dispatch, policy, transactions.length, navigate]);



  console.log('All transactions:', transactions);
  console.log('Transactions count:', transactions.length);
  transactions.forEach((t, i) => {
    console.log(`Transaction ${i}:`, {
      id: t.transactionId,
      type: t.transactionType,
      amount: t.amount,
      fundName: t.fundName
    });
  });

  const handleDownloadStatement = async () => {
    if (!policy) return;
    
    const policyId = policy.policyId || policy.id;
    setDownloadingPDF(true);
    try {
      const response = await fetch(`https://localhost:7073/api/policy/${policyId}/generate-statement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          setSnackbar({ 
            open: true, 
            message: 'Unable to generate statement. Please ensure you have fund investments to generate a report.', 
            severity: 'warning' 
          });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Verify it's a valid PDF
      if (blob.type !== 'application/pdf') {
        console.error('Invalid content type:', blob.type);
        throw new Error('Invalid PDF file received');
      }
      
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      setSnackbar({ 
        open: true, 
        message: 'Statement opened in new tab!', 
        severity: 'success' 
      });
      
    } catch (error) {
      console.error('Failed to download statement:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to generate statement. Please try again later.', 
        severity: 'error' 
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      if (!policy) return;
      
      const policyId = policy.policyId || policy.id;
      setPortfolioLoading(true);
      try {
        const response = await fetch(`https://localhost:7073/api/transaction/policy/${policyId}/portfolio-value`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio value:', error);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolioValue();
  }, [policy, transactions.length]);

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      if (!policy) return;
      
      const policyId = policy.policyId || policy.id;
      setPortfolioLoading(true);
      try {
        const response = await fetch(`https://localhost:7073/api/transaction/policy/${policyId}/portfolio-value`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio value:', error);
      } finally {
        setPortfolioLoading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && policy) {
        fetchPortfolioValue();
        const policyId = policy.policyId || policy.id;
        if (policyId) {
          dispatch(fetchTransactionsByPolicy(policyId));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [policy, dispatch]);

  if (loading || portfolioLoading) return <Loader />;
  if (!policy) return <Alert severity="error">Policy not found</Alert>;

  const fundData = portfolioData?.fundHoldings || [];
  const totalInvested = portfolioData?.totalInvested || 0;
  const totalCurrentValue = portfolioData?.totalCurrentValue || 0;

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <PageHeader title={`Fund Portfolio - ${policy.policyNumber}`} icon={<Assessment />} />
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            const policyId = policy.policyId || policy.id;
            if (policyId) {
              dispatch(fetchTransactionsByPolicy(policyId));
              window.location.reload();
            }
          }}
          sx={{ height: 'fit-content' }}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#60a5fa', fontWeight: 600, mb: 1 }}>Total Invested</Typography>
          <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 700 }}>₹{totalInvested.toLocaleString()}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#34d399', fontWeight: 600, mb: 1 }}>Current Value</Typography>
          <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 700 }}>₹{totalCurrentValue.toLocaleString()}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ 
            color: totalCurrentValue >= totalInvested ? '#34d399' : '#f87171',
            fontWeight: 600,
            mb: 1
          }}>
            Gain/Loss
          </Typography>
          <Typography variant="h4" sx={{ 
            color: totalCurrentValue >= totalInvested ? '#34d399' : '#f87171',
            fontWeight: 700
          }}>
            ₹{(totalCurrentValue - totalInvested).toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Fund Allocation */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Fund Allocation</Typography>
          {fundData.length > 0 ? (
            <Box>
              {fundData.map((fund, index) => {
                const percentage = totalInvested > 0 ? (fund.totalInvested / totalInvested * 100).toFixed(1) : '0';
                const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0'];
                return (
                  <Box key={fund.fundName} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{fund.fundName}</Typography>
                      <Typography variant="body2">{percentage}%</Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          bgcolor: colors[index % colors.length],
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography color="textSecondary" textAlign="center" py={4}>
              No fund investments found
            </Typography>
          )}
        </Paper>

        {/* Fund Details */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Fund Details</Typography>
            <Button
              variant="contained"
              startIcon={downloadingPDF ? <CircularProgress size={16} /> : <Download />}
              onClick={handleDownloadStatement}
              disabled={downloadingPDF}
            >
              Download Statement
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fund Name</TableCell>
                  <TableCell align="right">Invested</TableCell>
                  <TableCell align="right">Current Value</TableCell>
                  <TableCell align="right">Return</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fundData.map((fund) => (
                  <TableRow key={fund.fundName}>
                    <TableCell>{fund.fundName}</TableCell>
                    <TableCell align="right">₹{fund.totalInvested.toLocaleString()}</TableCell>
                    <TableCell align="right">₹{fund.currentValue.toLocaleString()}</TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ color: fund.returnPercentage >= 0 ? 'success.main' : 'error.main' }}
                    >
                      {fund.returnPercentage.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Transaction History */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Investment History</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Fund</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionId || transaction.id}>
                  <TableCell>
                    {(() => {
                      const dateValue = transaction.transactionDate || transaction.date;
                      return dateValue ? new Date(dateValue).toLocaleDateString() : 'N/A';
                    })()}
                  </TableCell>
                  <TableCell>{transaction.fundName}</TableCell>
                  <TableCell>{transaction.transactionType || transaction.type}</TableCell>
                  <TableCell align="right">₹{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.status || 'Completed'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
