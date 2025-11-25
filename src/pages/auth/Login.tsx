import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {  Security, TrendingUp, Shield } from '@mui/icons-material';
import { useAppDispatch } from '../../store';
import { authStart, authSuccess, authFailure } from '../../features/auth/authSlice';
import { authApi } from '../../api/auth_api';
import type { LoginDto, UserRole } from '../../types/auth';
import { getErrorMessage } from '../../utils/errorHandler';

const roleRedirects: Record<UserRole, string> = {
  Customer: '/customer/dashboard',
  Agent: '/agent/dashboard',
  Manager: '/manager/dashboard',
  Admin: '/admin/funds',
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(authStart());
    
    try {
      const response = await authApi.login(formData);
      const { token, userId, role, username } = response.data;
      
      if (!token || !userId || !role || !username) {
        throw new Error('Invalid response from server');
      }
      
      const user = {
        userId,
        firstName: username.split(' ')[0] || '',
        lastName: username.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        role: role as UserRole
      };
      
      dispatch(authSuccess({ token, user }));
      navigate(roleRedirects[user.role]);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      dispatch(authFailure(message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LoginDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };



  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backgroundColor: 'background.paper',
            display: 'flex',
            minHeight: '600px'
          }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              width: '50%',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0d7377 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              p: 3,
              position: 'relative'
            }}
          >
                <Box sx={{ textAlign: 'center', zIndex: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      fontSize: '2rem',
                      fontWeight: 700
                    }}
                  >
                    U
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    ULIP Portal
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    Your trusted partner for Unit Linked Insurance Plans
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Security sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body1">Secure & Trusted Platform</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUp sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body1">Investment Growth Tracking</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Shield sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body1">Comprehensive Insurance Coverage</Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 1
                  }}
                />
          </Box>
          
          {/* Form Section */}
          <Box
            sx={{ 
              width: '50%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 4
            }}
          >
              <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>

                
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Welcome Back
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Sign in to access your insurance dashboard
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange('email')}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-input': {
                        color: 'text.primary'
                      }
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange('password')}
                    sx={{ 
                      mb: 3,
                      '& .MuiInputBase-input': {
                        color: 'text.primary'
                      }
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      mb: 2,
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Signing in...
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '& .MuiAlert-message': { fontSize: '0.9rem' }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      New to ULIP Portal?{' '}
                      <Button
                        variant="text"
                        onClick={() => navigate('/register')}
                        sx={{ 
                          textTransform: 'none', 
                          p: 0, 
                          minWidth: 'auto',
                          fontWeight: 600,
                          color: '#1976d2',
                          '&:hover': {
                            color: '#1565c0',
                            backgroundColor: 'transparent'
                          }
                        }}
                      >
                        Create an account
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
