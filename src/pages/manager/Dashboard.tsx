import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Paper, Alert } from '@mui/material';
import { 
  Dashboard as DashboardIcon,  
  Warning, 
  CheckCircle,
  Cancel,
  Schedule,
  Approval,
  MonetizationOn,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchPendingApprovals, fetchOverduePremiums } from '../../features/manager/managerSlice';
import PageHeader from '../../components/PageHeader';
import StatsCard from '../../components/StatsCard';
import SeverityChip from '../../components/SeverityChip';
import Loader from '../../components/Loader';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pending, overdue, loading } = useAppSelector((state) => state.manager);
  const { user } = useAppSelector((state) => state.auth);
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());

  const loadSection = async (section: string) => {
    if (loadedSections.has(section)) return;
    
    setLoadedSections(prev => new Set(prev).add(section));
    
    if (section === 'approvals') {
      dispatch(fetchPendingApprovals());
    } else if (section === 'overdue') {
      dispatch(fetchOverduePremiums());
    }
  };

  // Auto-load dashboard data on mount
  useEffect(() => {
    loadSection('approvals');
    loadSection('overdue');
  }, []);

  useEffect(() => {
    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchPendingApprovals());
        dispatch(fetchOverduePremiums());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  if (loading) return <Loader />;

  const criticalOverdue = overdue.filter(item => item.daysOverdue >= 30).length;


  const statsData = [
    {
      title: 'Pending Approvals',
      value: pending.length,
      icon: <Schedule fontSize="large" />,
      color: '#f4a261',
      trend: 'neutral' as const,
      onClick: () => navigate('/manager/approvals'),
    },
    {
      title: 'Overdue Premiums',
      value: overdue.length,
      icon: <Warning fontSize="large" />,
      color: '#ef4444',
      trend: overdue.length > 10 ? 'down' as const : 'neutral' as const,
      onClick: () => navigate('/manager/overdue'),
    },
    {
      title: 'Critical Overdue',
      value: criticalOverdue,
      icon: <Cancel fontSize="large" />,
      color: '#dc2626',
      trend: 'down' as const,
      onClick: () => navigate('/manager/overdue'),
    },
  ];

  const recentApprovals = pending.slice(0, 5);
  const criticalOverdueList = overdue.filter(item => item.daysOverdue >= 30).slice(0, 5);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <PageHeader 
        title="Manager Dashboard" 
        icon={<DashboardIcon />}
        subtitle={`Welcome back, ${user?.firstName}! Monitor approvals and premium collections.`}
      />
      
      {/* Critical Alerts */}
      {criticalOverdue > 0 && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate('/manager/overdue')}
            >
              Review Now
            </Button>
          }
        >
          <Typography variant="body2">
            ⚠️ {criticalOverdue} policies have premiums overdue by 30+ days. Immediate attention required.
          </Typography>
        </Alert>
      )}
      
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
              startIcon={<Approval />}
              onClick={() => {
                loadSection('approvals');
                navigate('/manager/approvals');
              }}
              sx={{ py: 1.5 }}
            >
              Review Approvals
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<MonetizationOn />}
              onClick={() => navigate('/manager/premiums')}
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
              Premium Management
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Visibility />}
              onClick={() => navigate('/manager/documents')}
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
        {statsData.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              onClick={stat.onClick}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Approvals */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Schedule sx={{ color: 'warning.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Approval Requests
                </Typography>
              </Box>
              <Button 
                variant="outlined"
                size="small" 
                onClick={() => {
                  loadSection('approvals');
                  navigate('/manager/approvals');
                }}
                sx={{
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
                View All
              </Button>
            </Box>
            
            {recentApprovals.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  All Caught Up!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No pending approvals at the moment
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentApprovals.map((approval) => (
                  <Card key={approval.approvalId} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {approval.requestType}
                        </Typography>
                        <SeverityChip severity="warning" label="Pending" />
                      </Box>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Amount: ₹{approval.amount?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Requested by {approval.requestedByName || 'Unknown'} • {new Date(approval.requestedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Critical Overdue */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning sx={{ color: 'error.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Critical Overdue Premiums
                </Typography>
              </Box>
              <Button 
                variant="outlined"
                size="small" 
                onClick={() => {
                  loadSection('overdue');
                  navigate('/manager/overdue');
                }}
                sx={{
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
                View All
              </Button>
            </Box>
            
            {criticalOverdueList.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Critical Issues
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All premiums are up to date
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {criticalOverdueList.map((item) => (
                  <Card key={`overdue-${item.policyId}`} sx={{ border: '2px solid', borderColor: 'error.light' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Policy #{item.policyId}
                        </Typography>
                        <SeverityChip severity="error" label={`${item.daysOverdue} days`} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Holder: {item.holderName}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main' }}>
                        Amount Due: ₹{item.dueAmount.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
