import { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Card, Alert } from '@mui/material';
import { Policy, AccountBalance, TrendingUp, Assignment } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { fetchMyPolicies, fetchPendingProposals } from '../../features/customer/customerSlice';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { policies, pendingProposals, error } = useAppSelector((state) => state.customer);
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());

  const loadSection = async (section: string) => {
    if (loadedSections.has(section)) return;
    
    setLoadedSections(prev => new Set(prev).add(section));
    
    if (section === 'policies') {
      dispatch(fetchMyPolicies());
    } else if (section === 'proposals') {
      dispatch(fetchPendingProposals());
    }
  };

  if (user?.role === 'Agent') {
    navigate('/agent/dashboard');
    return <Loader />;
  }

  const activePolicies = policies.filter(p => (p.status === 'Active' || p.policyStatus === 'Active')).length;
  const totalPremiumPaid = policies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0);
  const totalSumAssured = policies.reduce((sum, p) => sum + (p.sumAssured || 0), 0);

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      backgroundColor: '#0a0e1a', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)'
    }}>
      <PageHeader 
        title="Customer Dashboard" 
        icon={<Policy />}
        subtitle={`Welcome back, ${user?.firstName}! Here's your insurance overview.`}
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
            mb: 2
          }}>
            Investment Portfolio Overview
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 3, maxWidth: 600 }}>
            Monitor your ULIP investments and insurance coverage. Track performance across all your active policies.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                Total Coverage: ₹{(totalSumAssured / 100000).toFixed(1)}L
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                Active Policies: {activePolicies}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                Total Invested: ₹{(totalPremiumPaid / 1000).toFixed(0)}K
              </Typography>
            </Box>
          </Box>
        </Box>
        
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
      </Paper>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Total Policies
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {policies.length}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Policy sx={{ color: '#3b82f6', fontSize: 32 }} />
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Active Policies
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {activePolicies}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <TrendingUp sx={{ color: '#22c55e', fontSize: 32 }} />
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Total Coverage
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ₹{(totalSumAssured / 100000).toFixed(1)}L
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <AccountBalance sx={{ color: '#f59e0b', fontSize: 32 }} />
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 3,
            p: 3,
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  Total Invested
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ₹{(totalPremiumPaid / 1000).toFixed(0)}K
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <TrendingUp sx={{ color: '#a855f7', fontSize: 32 }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Content - Single Column Layout */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          fontWeight: 700, 
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Assignment sx={{ color: '#60a5fa' }} />
          Recent Activity & Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {/* Activity Section */}
          <Grid size={{ xs: 8 }}>
            {pendingProposals.length > 0 ? (
              <Box sx={{ 
                p: 4, 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                borderRadius: 3,
                border: '1px solid rgba(245, 158, 11, 0.2)',
                mb: 3
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#f59e0b', mb: 2 }}>
                  {pendingProposals.length} New Proposal{pendingProposals.length > 1 ? 's' : ''} Awaiting Review
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                  Your agent has sent new policy proposals for your consideration. Review the terms and conditions before making your decision.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }
                  }}
                  onClick={() => {
                    loadSection('proposals');
                    navigate('/customer/proposals');
                  }}
                >
                  Review Proposals Now
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 4, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 3, border: '1px solid rgba(34, 197, 94, 0.2)', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#22c55e', mb: 2 }}>
                  Portfolio Status: Excellent
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  All your policies are active and performing well. Your investment portfolio is on track for long-term growth.
                </Typography>
              </Box>
            )}
            
            <Box sx={{ p: 4, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
                Investment Performance Update
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                Your ULIP investments are tracking market performance. Portfolio value reflects current market conditions and fund allocation strategies.
              </Typography>
              <Button 
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: '#60a5fa',
                  color: '#60a5fa',
                  '&:hover': { borderColor: '#3b82f6', backgroundColor: 'rgba(96, 165, 250, 0.1)' }
                }}
                onClick={() => {
                  loadSection('policies');
                  navigate('/customer/fund-portfolio');
                }}
              >
                View Detailed Portfolio
              </Button>
            </Box>
          </Grid>
          
          {/* Quick Actions */}
          <Grid size={{ xs: 4 }}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: 3,
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Policy />}
                  onClick={() => {
                    loadSection('policies');
                    navigate('/customer/policies');
                  }}
                  sx={{ 
                    py: 2,
                    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)' }
                  }}
                >
                  View My Policies
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assignment />}
                  onClick={() => {
                    loadSection('proposals');
                    navigate('/customer/proposals');
                  }}
                  sx={{ 
                    py: 2,
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { borderColor: '#d97706', backgroundColor: 'rgba(245, 158, 11, 0.1)' }
                  }}
                >
                  Pending Proposals
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}