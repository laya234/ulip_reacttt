import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Alert,
  Snackbar,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Policy, Visibility, Payment, Search, TrendingUp } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchMyPolicies, clearError } from '../../features/customer/customerSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import SeverityChip from '../../components/SeverityChip';
import EmptyStateIllustration from '../../components/EmptyStateIllustration';
import PayPremiumDialog from './PayPremiumDialog';

interface PolicyType {
  policyId?: number;
  id?: number;
  policyName: string;
  policyNumber: string;
  policyStatus?: string;
  status?: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: string;
  policyStartDate?: string;
}

export default function MyPolicies() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { policies, loading, error } = useAppSelector((state) => state.customer);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [payPremiumDialog, setPayPremiumDialog] = useState<{ open: boolean; policy: PolicyType | null }>({
    open: false,
    policy: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchMyPolicies());
  }, [dispatch]);

  useEffect(() => {
    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchMyPolicies());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  const handleViewPolicy = (policy: PolicyType) => {
    console.log('Navigating to policy detail with policy:', policy);
    navigate('/customer/policy-detail', { state: { policy } });
  };

  const handlePayPremium = (policy: PolicyType) => {
    setPayPremiumDialog({ open: true, policy });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    dispatch(clearError());
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (policy.policyStatus || policy.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'PendingAcceptance': return 'warning';
      case 'Expired': return 'error';
      case 'Cancelled': return 'cancelled';
      default: return 'info';
    }
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <PageHeader 
        title="My Policies" 
        icon={<Policy />}
        subtitle="Manage your insurance policies and premium payments"
      />
      
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      
      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
              {policies.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Total Policies
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
              {policies.filter(p => (p.policyStatus || p.status) === 'Active').length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Active Policies
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
              ₹{policies.reduce((sum, p) => sum + (p.sumAssured || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Total Coverage
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
              ₹{policies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Total Premiums
            </Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="Search by policy name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="PendingAcceptance">Pending</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <Paper sx={{ borderRadius: 2 }}>
          <EmptyStateIllustration
            icon={<Policy sx={{ fontSize: 48 }} />}
            title={searchTerm || statusFilter !== 'All' ? 'No Matching Policies' : 'No Policies Found'}
            description={searchTerm || statusFilter !== 'All' ? 'Try adjusting your search or filter criteria' : 'You don\'t have any policies yet. Contact an agent to get started.'}
          />
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 2 
        }}>
          {filteredPolicies.map((policy) => {
            const status = policy.policyStatus || policy.status;
            const isActive = status === 'Active';
            const policyKey = policy.policyId || policy.id || policy.policyNumber;
            
            return (
                <Card 
                  key={policyKey}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isActive ? '2px solid' : '1px solid',
                    borderColor: isActive ? 'success.light' : 'grey.200',
                    '&:hover': {
                      borderColor: isActive ? 'success.main' : 'primary.light',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {policy.policyName}
                      </Typography>
                      <SeverityChip 
                        severity={getStatusSeverity(status || 'Unknown') as 'success' | 'warning' | 'error' | 'info'}
                        label={status || 'Unknown'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Policy No: {policy.policyNumber}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Sum Assured:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          ₹{(policy.sumAssured || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Premium:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          ₹{(policy.premiumAmount || 0).toLocaleString()} ({policy.premiumFrequency || 'N/A'})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Start Date:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {policy.policyStartDate ? new Date(policy.policyStartDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewPolicy(policy)}
                        fullWidth
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          }
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {isActive && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Payment />}
                            onClick={() => handlePayPremium(policy)}
                            sx={{ 
                              flex: 1,
                              backgroundColor: '#15803d',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#14532d'
                              }
                            }}
                          >
                            Pay Premium
                          </Button>
                        )}
                        
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<TrendingUp />}
                          onClick={() => navigate('/customer/portfolio', { state: { policy } })}
                          sx={{ 
                            flex: 1,
                            backgroundColor: '#285e65ff',
                            color: 'white',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#184b8aff'
                            }
                          }}
                        >
                          View Portfolio
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
            );
          })}
        </Box>
      )}

      {payPremiumDialog.policy && (
        <PayPremiumDialog
          open={payPremiumDialog.open}
          policy={payPremiumDialog.policy}
          onClose={() => setPayPremiumDialog({ open: false, policy: null })}
          onSuccess={(message) => {
            setSnackbar({ open: true, message, severity: 'success' });
            dispatch(fetchMyPolicies()); // Refresh policies after payment
          }}
          onError={(message) => setSnackbar({ open: true, message, severity: 'error' })}
        />
      )}

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