import { useEffect } from 'react';
import { Box, Alert, Paper, Typography, Grid, Button, Card, CardContent } from '@mui/material';
import { Assessment, TrendingUp, People, AccountBalance, Dashboard as DashboardIcon, Add, Visibility } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../../features/agent/agentSlice';
import PageHeader from '../../components/PageHeader';

import StatsCard from '../../components/StatsCard';
import SeverityChip from '../../components/SeverityChip';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { leads = [], conversionRate = 0, totalCommission = 0, error } = useAppSelector((state) => state.agent);
  
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchDashboardData());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const pendingLeads = leads.filter(l => l.status === 'Pending').length;
  const rejectedLeads = leads.filter(l => l.status === 'Rejected').length;

  const summaryCards = [
    {
      title: 'Total Leads',
      value: leads.length,
      icon: <People fontSize="large" />,
      color: '#1e3a5f',
      trend: 'up' as const,
      onClick: () => navigate('/agent/pipeline')
    },
    {
      title: 'Conversion Rate',
      value: `${(conversionRate * 100).toFixed(1)}%`,
      icon: <TrendingUp fontSize="large" />,
      color: '#0d7377',
      trend: conversionRate > 0.3 ? 'up' as const : 'neutral' as const,
      onClick: () => {}
    },
    {
      title: 'Total Commission',
      value: `₹${totalCommission.toLocaleString()}`,
      icon: <AccountBalance fontSize="large" />,
      color: '#f4a261',
      trend: 'up' as const,
      onClick: () => {}
    },
    {
      title: 'Converted Leads',
      value: convertedLeads,
      icon: <Assessment fontSize="large" />,
      color: '#22c55e',
      trend: 'up' as const,
      onClick: () => navigate('/agent/pipeline')
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <PageHeader 
        title="Agent Dashboard" 
        icon={<DashboardIcon />}
        subtitle={`Welcome back, ${user?.firstName}! Here's your sales overview.`}
      />
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={() => navigate('/agent/pipeline')}
              sx={{ py: 1.5 }}
            >
              Add New Lead
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Visibility />}
              onClick={() => navigate('/agent/pipeline')}
              sx={{ 
                py: 1.5,
                color: '#1976d2',
                borderColor: '#1976d2',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1565c0',
                  color: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              View Pipeline
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Assessment />}
              onClick={() => navigate('/agent/documents')}
              sx={{ 
                py: 1.5,
                color: '#1976d2',
                borderColor: '#1976d2',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1565c0',
                  color: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Document Review
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              trend={card.trend}
              onClick={card.onClick}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Leads
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/agent/pipeline')}
                sx={{
                  color: '#60a5fa',
                  borderColor: '#60a5fa',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    color: '#3b82f6'
                  }
                }}
              >
                View All
              </Button>
            </Box>
            
            {leads.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {leads.slice(0, 5).map((lead, index) => (
                  <Card key={index} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {lead.customerName || `Lead ${index + 1}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lead.customerPhone || 'No phone provided'}
                          </Typography>
                        </Box>
                        <SeverityChip 
                          severity={lead.status === 'Converted' ? 'success' : lead.status === 'Rejected' ? 'error' : 'warning'}
                          label={lead.status}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <People sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Leads Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Start building your pipeline by adding new leads
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => navigate('/agent/pipeline')}
                >
                  Add First Lead
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Lead Summary
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Pending</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#f1f5f9' }}>{pendingLeads}</Typography>
                  <SeverityChip severity="warning" label="Pending" />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Converted</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#f1f5f9' }}>{convertedLeads}</Typography>
                  <SeverityChip severity="success" label="Converted" />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Rejected</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#f1f5f9' }}>{rejectedLeads}</Typography>
                  <SeverityChip severity="error" label="Rejected" />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
