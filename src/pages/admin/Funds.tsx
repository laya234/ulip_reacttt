import { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, AdminPanelSettings, TrendingUp, TrendingDown, ShowChart } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchFunds, createFund, updateNav } from '../../features/fund/fundSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import EmptyStateIllustration from '../../components/EmptyStateIllustration';
import type { CreateFundRequest, Fund } from '../../types/fund';

export default function Funds() {
  const dispatch = useAppDispatch();
  const { funds, loading, error } = useAppSelector((state) => state.fund);
  
  const [fundDialog, setFundDialog] = useState(false);
  const [navDialog, setNavDialog] = useState<{ open: boolean; fund: Fund | null }>({ open: false, fund: null });
  const [fundData, setFundData] = useState<CreateFundRequest>({
    fundName: '',
    fundType: 'Equity',
    currentNAV: 10,
    expenseRatio: 1.5,
    riskLevel: 'Medium',
    description: '',
  });
  const [navValue, setNavValue] = useState(0);
  const [navLoading, setNavLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  const handleCreateFund = async () => {
    try {
      await dispatch(createFund(fundData)).unwrap();
      setSnackbar({ open: true, message: 'Fund created successfully!', severity: 'success' });
      setFundDialog(false);
      setFundData({ fundName: '', fundType: 'Equity', currentNAV: 10, expenseRatio: 1.5, riskLevel: 'Medium', description: '' });
      dispatch(fetchFunds());
    } catch {
      setSnackbar({ open: true, message: 'Failed to create fund', severity: 'error' });
    }
  };

  const handleUpdateNav = async () => {
    if (!navDialog.fund || navLoading) return;
    
    setNavLoading(true);
    try {
      await dispatch(updateNav({ fundId: navDialog.fund.fundId, newNAV: navValue })).unwrap();
      setSnackbar({ open: true, message: `NAV updated successfully to ₹${navValue.toFixed(2)}!`, severity: 'success' });
      setNavDialog({ open: false, fund: null });
    } catch (error: unknown) {
      const err = error as Error;
      setSnackbar({ open: true, message: err?.message || 'Failed to update NAV', severity: 'error' });
    } finally {
      setNavLoading(false);
    }
  };

  const openNavDialog = (fund: Fund) => {
    setNavDialog({ open: true, fund });
    setNavValue(fund?.currentNAV || 0);
  };



  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'info';
    }
  };

  const getFundTypeIcon = (type: string) => {
    switch (type) {
      case 'Equity': return <TrendingUp />;
      case 'Debt': return <ShowChart />;
      case 'Hybrid': return <TrendingDown />;
      default: return <ShowChart />;
    }
  };

  const totalFunds = funds?.length || 0;
  const avgNAV = funds?.length > 0 ? funds.reduce((sum, f) => sum + (f.currentNAV || 0), 0) / funds.length : 0;
  const equityFunds = funds?.filter(f => f.fundType === 'Equity').length || 0;
  const debtFunds = funds?.filter(f => f.fundType === 'Debt').length || 0;

  if (loading) return <Loader />;

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      backgroundColor: '#0a0e1a', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)'
    }}>
      <PageHeader 
        title="Fund Management" 
        icon={<AdminPanelSettings />}
        subtitle="Manage investment funds and update NAV values"
      />
      
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      
      {/* Hero Section */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            color: 'white', 
            mb: 2,
            background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Investment Fund Portfolio
          </Typography>
          <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 3, maxWidth: 600 }}>
            Monitor and manage your complete fund ecosystem. Track performance, update NAV values, and oversee fund allocations across equity, debt, and hybrid instruments.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#22c55e' 
              }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Active Funds: {totalFunds}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6' 
              }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Avg NAV: ₹{avgNAV.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#f59e0b' 
              }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Portfolio Value: ₹{((totalFunds || 0) * (avgNAV || 0) * 50000).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)',
          zIndex: 1
        }} />
      </Paper>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Total Funds
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {totalFunds}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <AdminPanelSettings sx={{ color: '#3b82f6', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#22c55e' }}>+12% from last month</Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Average NAV
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ₹{avgNAV.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.2)'
              }}>
                <ShowChart sx={{ color: '#34d399', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChart sx={{ color: '#6b7280', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#6b7280' }}>Stable performance</Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Equity Funds
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {equityFunds}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <TrendingUp sx={{ color: '#22c55e', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#22c55e' }}>High growth potential</Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Debt Funds
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {debtFunds}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <TrendingDown sx={{ color: '#f59e0b', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChart sx={{ color: '#f59e0b', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#f59e0b' }}>Stable returns</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Fund Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          fontWeight: 700, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <ShowChart sx={{ color: '#60a5fa' }} />
          Fund Portfolio
        </Typography>
        
        {!funds || funds.length === 0 ? (
          <Paper sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <EmptyStateIllustration
              title="No Funds Available"
              description="Create your first investment fund to get started with fund management."
              icon={<AdminPanelSettings />}
            />
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {(funds || []).map((fund) => {
              const currentNAV = fund?.currentNAV || 0;
              const performanceColor = currentNAV > 10 ? '#22c55e' : currentNAV < 10 ? '#ef4444' : '#f59e0b';
              const performanceIcon = currentNAV > 10 ? <TrendingUp /> : currentNAV < 10 ? <TrendingDown /> : <ShowChart />;
              
              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={fund.fundId}>
                  <Card sx={{ 
                    height: '100%',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      borderColor: 'rgba(96, 165, 250, 0.3)'
                    }
                  }}>
                    {/* Performance indicator */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${performanceColor} 0%, ${performanceColor}80 100%)`
                    }} />
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: `${performanceColor}20`,
                            border: `1px solid ${performanceColor}40`
                          }}>
                            {getFundTypeIcon(fund.fundType)}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                              {fund.fundName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                              Fund ID: #{fund.fundId}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Tooltip title="Update NAV">
                          <IconButton 
                            size="small" 
                            onClick={() => openNavDialog(fund)}
                            sx={{ 
                              backgroundColor: 'rgba(96, 165, 250, 0.1)',
                              border: '1px solid rgba(96, 165, 250, 0.2)',
                              color: '#60a5fa',
                              '&:hover': { 
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      {/* Fund Type and Risk Badges */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                        <Box sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: fund.fundType === 'Equity' ? 'rgba(34, 197, 94, 0.1)' : 
                                         fund.fundType === 'Debt' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          border: `1px solid ${fund.fundType === 'Equity' ? 'rgba(34, 197, 94, 0.2)' : 
                                              fund.fundType === 'Debt' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: fund.fundType === 'Equity' ? '#22c55e' : 
                                   fund.fundType === 'Debt' ? '#3b82f6' : '#f59e0b',
                            fontWeight: 600
                          }}>
                            {fund.fundType}
                          </Typography>
                        </Box>
                        
                        <Box sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: getRiskColor(fund.riskLevel) === 'success' ? 'rgba(34, 197, 94, 0.1)' :
                                         getRiskColor(fund.riskLevel) === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: `1px solid ${getRiskColor(fund.riskLevel) === 'success' ? 'rgba(34, 197, 94, 0.2)' :
                                               getRiskColor(fund.riskLevel) === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                          <Typography variant="caption" sx={{ 
                            color: getRiskColor(fund.riskLevel) === 'success' ? '#22c55e' :
                                   getRiskColor(fund.riskLevel) === 'warning' ? '#f59e0b' : '#ef4444',
                            fontWeight: 600
                          }}>
                            {fund.riskLevel} Risk
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* NAV Display */}
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mb: 3
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                            Current NAV
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {performanceIcon}
                            <Typography variant="caption" sx={{ color: performanceColor }}>
                              {currentNAV > 10 ? '+' : currentNAV < 10 ? '-' : ''}{
                                Math.abs(((currentNAV - 10) / 10) * 100).toFixed(1)
                              }%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h4" sx={{ 
                          color: performanceColor, 
                          fontWeight: 700,
                          fontSize: '2rem'
                        }}>
                          ₹{currentNAV.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      {/* Fund Details */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Expense Ratio:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {fund?.expenseRatio || 0}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Lock-in Period:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {fund.fundType === 'Equity' ? '3 Years' : fund.fundType === 'Debt' ? '1 Year' : '2 Years'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Min Investment:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            ₹{(fund.fundType === 'Equity' ? 5000 : fund.fundType === 'Debt' ? 1000 : 2500).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {fund.description && (
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 400 }}>
                            {fund.description}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      <Fab
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
          color: 'white',
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(96, 165, 250, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(96, 165, 250, 0.4)'
          }
        }}
        onClick={() => setFundDialog(true)}
      >
        <Add sx={{ fontSize: 28 }} />
      </Fab>

      {/* Create Fund Dialog */}
      <Dialog 
        open={fundDialog} 
        onClose={() => setFundDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
          Create New Fund
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Fund Name"
              value={fundData.fundName}
              onChange={(e) => setFundData({ ...fundData, fundName: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputBase-input': { color: '#f8fafc' },
              }}
            />
            <FormControl required>
              <InputLabel sx={{ color: '#94a3b8' }}>Fund Type</InputLabel>
              <Select
                value={fundData.fundType}
                onChange={(e) => setFundData({ ...fundData, fundType: e.target.value as 'Equity' | 'Debt' | 'Hybrid' })}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                  color: '#f8fafc'
                }}
              >
                <MenuItem value="Equity">Equity</MenuItem>
                <MenuItem value="Debt">Debt</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Initial NAV"
              type="number"
              value={fundData.currentNAV}
              onChange={(e) => setFundData({ ...fundData, currentNAV: Number(e.target.value) })}
              required
              inputProps={{ step: 0.01, min: 0 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputBase-input': { color: '#f8fafc' },
              }}
            />
            <TextField
              label="Expense Ratio (%)"
              type="number"
              value={fundData.expenseRatio}
              onChange={(e) => setFundData({ ...fundData, expenseRatio: Number(e.target.value) })}
              required
              inputProps={{ step: 0.01, min: 0, max: 10 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputBase-input': { color: '#f8fafc' },
              }}
            />
            <FormControl required>
              <InputLabel sx={{ color: '#94a3b8' }}>Risk Level</InputLabel>
              <Select
                value={fundData.riskLevel}
                onChange={(e) => setFundData({ ...fundData, riskLevel: e.target.value as 'Low' | 'Medium' | 'High' })}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                  color: '#f8fafc'
                }}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              multiline
              rows={3}
              value={fundData.description}
              onChange={(e) => setFundData({ ...fundData, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputBase-input': { color: '#f8fafc' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <Button 
            onClick={() => setFundDialog(false)}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFund} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
              }
            }}
          >
            Create Fund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update NAV Dialog */}
      <Dialog 
        open={navDialog.open} 
        onClose={() => setNavDialog({ open: false, fund: null })} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
          Update NAV - {navDialog.fund?.fundName}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="New NAV Value"
            type="number"
            value={navValue}
            onChange={(e) => setNavValue(Number(e.target.value))}
            fullWidth
            required
            inputProps={{ step: 0.01, min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#60a5fa' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#f8fafc' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <Button 
            onClick={() => setNavDialog({ open: false, fund: null })}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateNav} 
            variant="contained"
            disabled={navLoading || !navValue || navValue <= 0}
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
              },
              '&:disabled': {
                background: 'rgba(148, 163, 184, 0.2)',
                color: 'rgba(148, 163, 184, 0.5)'
              }
            }}
          >
            {navLoading ? 'Updating...' : 'Update NAV'}
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
