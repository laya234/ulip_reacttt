import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Alert,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { People, Search, AdminPanelSettings, Person, Business, Support, TrendingUp } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchUsers } from '../../features/user/userSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import EmptyStateIllustration from '../../components/EmptyStateIllustration';


export default function Users() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUsers()).catch(() => {
      console.warn('Users endpoint not available yet');
    });
  }, [dispatch]);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Manager': return 'warning';
      case 'Agent': return 'info';
      case 'Customer': return 'success';
      default: return 'default';
    }
  };



  if (loading) return <Loader />;

  const totalUsers = users.length;

  const agentUsers = users.filter(u => u.role === 'Agent').length;
  const customerUsers = users.filter(u => u.role === 'Customer').length;
  const managerUsers = users.filter(u => u.role === 'Manager').length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <AdminPanelSettings />;
      case 'Manager': return <Business />;
      case 'Agent': return <Support />;
      case 'Customer': return <Person />;
      default: return <Person />;
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      backgroundColor: '#0a0e1a', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)'
    }}>
      <PageHeader 
        title="User Management" 
        icon={<People />}
        subtitle="Manage system users and monitor their activities across all roles"
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
            User Management System
          </Typography>
          <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 3, maxWidth: 600 }}>
            Comprehensive user administration dashboard. Monitor user activities, manage roles, and track performance metrics across your organization.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Total Users: {totalUsers}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Active Agents: {agentUsers}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                Customers: {customerUsers}
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
      </Paper>
      
      {/* Enhanced Stats Cards */}
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
                  Total Users
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {totalUsers}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <People sx={{ color: '#3b82f6', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#22c55e' }}>+8% from last month</Typography>
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
                  Agents
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {agentUsers}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                <Support sx={{ color: '#34d399', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Support sx={{ color: '#34d399', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#34d399' }}>Sales team active</Typography>
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
                  Customers
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {customerUsers}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <Person sx={{ color: '#f59e0b', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#22c55e' }}>Growing base</Typography>
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
                  Managers
                </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {managerUsers}
                </Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <Business sx={{ color: '#ef4444', fontSize: 32 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ color: '#ef4444', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#ef4444' }}>Leadership team</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Search Bar */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <TextField
          fullWidth
          label="Search users by name or email..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
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
      </Paper>
      
      {/* Users Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          fontWeight: 700, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <People sx={{ color: '#60a5fa' }} />
          User Directory
        </Typography>
        
        {filteredUsers.length === 0 ? (
          <Paper sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <EmptyStateIllustration
              title="No Users Found"
              description="No users match your search criteria or no users have been added yet."
              icon={<People />}
            />
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user) => {
              const roleColor = getRoleColor(user.role);
              const roleColorMap = {
                error: '#ef4444',
                warning: '#f59e0b', 
                info: '#3b82f6',
                success: '#22c55e',
                default: '#6b7280'
              };
              const color = roleColorMap[roleColor as keyof typeof roleColorMap] || '#6b7280';
              
              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={user.userId}>
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
                    {/* Role indicator */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
                    }} />
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: `${color}20`,
                          border: `2px solid ${color}40`,
                          color: color,
                          fontSize: '1.5rem',
                          fontWeight: 700
                        }}>
                          {user.firstName[0]}{user.lastName[0]}
                        </Avatar>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                            ID: #{user.userId}
                          </Typography>
                        </Box>
                        
                        <Box sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: `${color}20`,
                          border: `1px solid ${color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {getRoleIcon(user.role)}
                          <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>
                            {user.role}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* User Details */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Email:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.8rem' }}>
                            {user.email}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Phone:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {user.phoneNumber}
                          </Typography>
                        </Box>
                        
                        {user.totalCommissionEarned > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Commission:</Typography>
                            <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                              ₹{user.totalCommissionEarned.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                        
                        {user.policiesSold > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Policies Sold:</Typography>
                            <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 600 }}>
                              {user.policiesSold}
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Joined:</Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
