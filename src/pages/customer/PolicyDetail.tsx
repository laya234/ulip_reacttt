import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Box,Typography,Paper,Button,Alert,Snackbar,Divider,Card,CardContent,Grid} from '@mui/material';
import { Policy, TrendingUp, AccountBalance, Assessment, Info } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store';
import {fetchCompleteDetails,requestSurrender,clearError,} from '../../features/customer/customerSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import InvestDialog from './InvestDialog';
import SurrenderDialog from './SurrenderDialog';

export default function PolicyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPolicy, transactions, funds: storeFunds, loading, error } = useAppSelector((state) => state.customer);
  
  const policyFromState = location.state?.policy;
  const policy = policyFromState || currentPolicy;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [investDialog, setInvestDialog] = useState(false);
  const [surrenderDialog, setSurrenderDialog] = useState(false);
  interface Fund {
    fundId: number;
    fundName: string;
    fundType: string;
    riskLevel: string;
    currentNAV: number;
    expenseRatio: number;
  }

  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundDetailsDialog, setFundDetailsDialog] = useState(false);
  const funds = storeFunds as Fund[];

  useEffect(() => {
    if (!policy) {
      console.log('No policy found, redirecting to policies list');
      navigate('/customer/policies');
      return;
    }
    
    const policyId = policy.policyId || policy.id;
    if (!policyId) return;
    
    dispatch(fetchCompleteDetails(policyId));
  }, [dispatch, policy, navigate]);

  const handleSurrenderRequest = async (reason: string, managerId?: number) => {
    const policyId = policy?.policyId || policy?.id;
    if (!policyId) return;
    
    try {
      await dispatch(requestSurrender({ 
        policyId, 
        reason, 
        managerId 
      })).unwrap();
      setSnackbar({ 
        open: true, 
        message: 'Surrender request submitted successfully!', 
        severity: 'success' 
      });
    } catch {
      setSnackbar({ open: true, message: 'Failed to submit surrender request', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    dispatch(clearError());
  };

  if (loading) return <Loader />;
  if (!policy) return <Alert severity="error">Policy not found</Alert>;

  return (
    <Box p={3}>
      <PageHeader title={`Policy Details - ${policy.policyNumber}`} icon={<Policy />} />
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: { md: 2 } }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Investment Funds
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {funds.map((fund) => (
                <Grid size={{ xs: 12, sm: 6 }} key={fund.fundId}>
                  <Card sx={{ 
                    height: '100%',
                    border: '1px solid #e0e0e0',
                    '&:hover': { borderColor: '#1976d2', boxShadow: 2 }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          {fund.fundName}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600,
                            color: fund.riskLevel === 'High' ? '#d32f2f' : fund.riskLevel === 'Medium' ? '#ed6c02' : '#2e7d32'
                          }}
                        >
                          {fund.riskLevel}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {fund.fundType}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Current NAV:</strong> ₹{fund.currentNAV?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Expense Ratio:</strong> {fund.expenseRatio}%
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Info />}
                        onClick={() => {
                          setSelectedFund(fund);
                          setFundDetailsDialog(true);
                        }}
                        sx={{ mt: 2 }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Box sx={{ flex: { md: 1 } }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<TrendingUp />}
                onClick={() => setInvestDialog(true)}
                disabled={(policy.policyStatus || policy.status) !== 'Active'}
                sx={{
                  backgroundColor: '#074584ff',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Invest / Fund Switch
              </Button>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                onClick={() => navigate('/customer/portfolio', { state: { policy } })}
                sx={{ 
                  backgroundColor: '#0b4e91ff',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                View Portfolio
              </Button>
              <Button
                variant="contained"
                startIcon={<AccountBalance />}
                onClick={() => setSurrenderDialog(true)}
                disabled={(policy.policyStatus || policy.status) !== 'Active'}
                sx={{
                  backgroundColor: '#b11515ff',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#c62828'
                  }
                }}
              >
                Request Surrender
              </Button>

            </Box>
          </Paper>
        </Box>
      </Box>

      <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fund</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.transactionId || transaction.id}>
                        <TableCell>{transaction.transactionId || transaction.id}</TableCell>
                        <TableCell>{transaction.transactionType || transaction.type}</TableCell>
                        <TableCell>₹{(transaction.amount || 0).toLocaleString()}</TableCell>
                        <TableCell>{transaction.status || 'Completed'}</TableCell>
                        <TableCell>{transaction.fundName}</TableCell>
                        <TableCell>
                          {(() => {
                            const dateValue = transaction.transactionDate || transaction.date;
                            return dateValue ? new Date(dateValue).toLocaleDateString() : 'N/A';
                          })()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
      </Box>

      <InvestDialog
        open={investDialog}
        policyId={policy.policyId || policy.id}
        onClose={() => setInvestDialog(false)}
        onSuccess={(message) => {
          setSnackbar({ open: true, message, severity: 'success' });
          const policyId = policy?.policyId || policy?.id;
          if (policyId) {
            dispatch(fetchCompleteDetails(policyId));
          }
        }}
        onError={(message) => setSnackbar({ open: true, message, severity: 'error' })}
      />

      <SurrenderDialog
        open={surrenderDialog}
        policyId={policy.policyId || policy.id}
        policyNumber={policy.policyNumber}
        onClose={() => setSurrenderDialog(false)}
        onSubmit={handleSurrenderRequest}
      />

      <Dialog open={fundDetailsDialog} onClose={() => setFundDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selectedFund?.fundName}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: selectedFund?.riskLevel === 'High' ? '#d32f2f' : selectedFund?.riskLevel === 'Medium' ? '#ed6c02' : '#2e7d32'
            }}
          >
            {selectedFund?.riskLevel}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFund && (
            <FundDetailsContent fundId={selectedFund.fundId} />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setFundDetailsDialog(false)}
            sx={{ 
              bgcolor: 'white',
              color: 'black'
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setFundDetailsDialog(false);
              setInvestDialog(true);
            }}
            disabled={(policy.policyStatus || policy.status) !== 'Active'}
          >
            Invest Now
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

function FundDetailsContent({ fundId }: { fundId: number }) {
  interface FundDetails {
    description: string;
    fundType: string;
    riskLevel: string;
    currentNAV: number;
    expenseRatio: number;
    oneYearReturn: number;
    threeYearReturn: number;
    fiveYearReturn: number;
    benefits: string;
    suitableFor: string;
  }

  const [details, setDetails] = useState<FundDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://localhost:7073/api/fund/${fundId}/details`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch fund details:', err);
        setLoading(false);
      });
  }, [fundId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!details) return <Typography>Failed to load fund details</Typography>;

  return (
    <Box>
      <Typography variant="body1" paragraph>
        {details.description}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>Fund Information</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Fund Type</Typography>
          <Typography variant="body1">{details.fundType}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Risk Level</Typography>
          <Typography variant="body1">{details.riskLevel}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Current NAV</Typography>
          <Typography variant="body1">₹{details.currentNAV?.toFixed(2)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Expense Ratio</Typography>
          <Typography variant="body1">{details.expenseRatio}%</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>Historical Returns</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">1 Year</Typography>
          <Typography variant="h6" color="success.main">{details.oneYearReturn}%</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">3 Years</Typography>
          <Typography variant="h6" color="success.main">{details.threeYearReturn}%</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">5 Years</Typography>
          <Typography variant="h6" color="success.main">{details.fiveYearReturn}%</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>Key Benefits</Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
        {details.benefits}
      </Typography>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>Suitable For</Typography>
      <Typography variant="body2">
        {details.suitableFor}
      </Typography>
    </Box>
  );
}